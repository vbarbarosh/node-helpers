const ignore = require('./ignore');
const ssh2 = require('ssh2');
const waitcb = require('./waitcb');

async function sftp_get_stream_range(url, first, last, {user_friendly_status = ignore} = {})
{
    const u = new URL(url);
    const host = u.hostname; // u.host would include the :port, breaking dns lookup
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

    try {
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
        // 'close' fires on end, on error, and also when the consumer
        // destroys the stream early (e.g. an aborted http range request) —
        // 'end'/'error' alone would leak the connection in that case.
        out.once('close', function () {
            // destroying the connection errors the in-flight sftp requests
            // (prefetched READs) with "No response from server", and those
            // land on this already-closed stream — ignore them
            out.on('error', ignore);
            conn.destroy();
        });
        return out;
    }
    catch (error) {
        conn.destroy();
        throw error;
    }
}

module.exports = sftp_get_stream_range;
