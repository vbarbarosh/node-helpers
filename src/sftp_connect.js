const crypto = require('crypto');
const ssh2 = require('ssh2');

// The unverified servers already warned about. A transfer in parts opens many
// connections to one server, and one warning says all there is to say.
const warned = new Set();

// sftp://user:pass@example.com:22/path?fingerprint=SHA256:mEy/QR7so0+QUZXGSoxOzuLJ5MCzRPdxrxoOivArdH4
// sftp://user:pass@example.com:22/path?fingerprint=any
// sftp://user:pass@example.com:22/path  (the host key is not verified, with a warning)
async function sftp_connect(url, {fingerprint} = {})
{
    const u = new URL(url);
    const host = u.hostname; // u.host would include the :port, breaking dns lookup
    const port = +u.port || 22;
    const username = decodeURIComponent(u.username);
    const password = decodeURIComponent(u.password);
    const expected = fingerprints(fingerprint ?? u.searchParams.get('fingerprint'));
    let denied = null;

    if (expected.includes('any')) {
        warn_once(`sftp_connect: the host key of ${host}:${port} is not verified`);
    }

    // Called with the server's host key before any credentials are sent
    const host_verifier = function (key) {
        if (expected.includes('any')) {
            return true;
        }
        const presented = `SHA256:${crypto.createHash('sha256').update(key).digest('base64').replace(/=+$/, '')}`;
        if (expected.includes(presented)) {
            return true;
        }
        // No fingerprint to check against: connects, as up to v3.79.2
        if (expected.length === 0) {
            warn_once(`sftp_connect: the host key of ${host}:${port} is not verified, no fingerprint is given; it presented ${presented}. If that is the server you expect, add fingerprint=${presented} to the url`);
            return true;
        }
        denied = new Error(`sftp_connect: the host key of ${host}:${port} does not match: it presented ${presented}, expected ${expected.join(' or ')}`);
        denied.code = 'ERR_SFTP_HOST_KEY_MISMATCH';
        denied.fingerprint = presented;
        return false;
    };

    const conn = new ssh2.Client();
    try {
        await new Promise(function (resolve, reject) {
            conn.once('ready', resolve);
            conn.once('error', error => reject(denied ?? error));
            conn.connect({host, port, username, password, hostVerifier: host_verifier});
        });
    }
    catch (error) {
        conn.destroy();
        throw error;
    }
    return conn;
}

function warn_once(message)
{
    if (warned.has(message)) {
        return;
    }
    // Bounded: a process that visits servers without end starts over
    if (warned.size >= 1000) {
        warned.clear();
    }
    warned.add(message);
    process.emitWarning(message, {code: 'SFTP_HOST_KEY_NOT_VERIFIED'});
}

// 'SHA256:a,SHA256:b' or ['SHA256:a', 'SHA256:b'] -> ['SHA256:a', 'SHA256:b']
function fingerprints(value)
{
    if (value === undefined || value === null) {
        return [];
    }
    // A raw "+" of base64 in a query string is read back as a space
    return [].concat(value).flatMap(v => String(v).split(',')).map(v => v.trim().replaceAll(' ', '+')).filter(v => v);
}

module.exports = sftp_connect;
