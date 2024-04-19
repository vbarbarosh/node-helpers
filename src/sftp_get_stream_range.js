const ignore = require('./ignore');
const ssh2 = require('ssh2');
const waitcb = require('./waitcb');

async function sftp_get_stream_range(url, first, last, {user_friendly_status = ignore} = {})
{
    const u = new URL(url);
    const host = u.host;
    const port = +u.port || 22;
    const username = decodeURIComponent(u.username);
    const password = decodeURIComponent(u.password);
    const pathname = u.pathname;

    user_friendly_status('Establishing connection...');
    const conn = new ssh2.Client();
    await new Promise(function (resolve, reject) {
        conn.on('ready', resolve);
        conn.on('error', reject);
        conn.connect({host, port, username, password});
    });

    user_friendly_status('Asking for an sftp service...');
    const sftp = await waitcb(cb => conn.sftp(cb));

    user_friendly_status('Requesting file info...');
    const stat = await waitcb(cb => sftp.stat(pathname, cb));

    if (first < 0 || last >= stat.size) {
        throw new Error(`Invalid range: [first=${first}][last=${last}]`);
    }

    const out = sftp.createReadStream(pathname, {start: first, end: last})
    out.content_range = {
        type: 'bytes',
        first,
        last,
        total: stat.size,
    };
    out.total = out.content_range.total;
    out.once('error', function () {
        conn.destroy();
    });
    out.once('end', function () {
        conn.destroy();
    });
    return out;
}

module.exports = sftp_get_stream_range;
