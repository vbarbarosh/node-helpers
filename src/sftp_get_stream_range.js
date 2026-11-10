const ignore = require('./ignore');
const sftp_connect = require('./sftp_connect');
const stream = require('stream');
const waitcb = require('./waitcb');

async function sftp_get_stream_range(url, first, last, {user_friendly_status = ignore, fingerprint} = {})
{
    const pathname = new URL(url).pathname;

    user_friendly_status('Establishing connection...');
    const conn = await sftp_connect(url, {fingerprint});
    // An error of the connection after this point reaches the caller through
    // the stream, as before
    conn.on('error', ignore);

    try {
        user_friendly_status('Asking for an sftp service...');
        const sftp = await waitcb(cb => conn.sftp(cb));

        user_friendly_status('Requesting file info...');
        const stat = await waitcb(cb => sftp.stat(pathname, cb));

        // An empty file has no byte to open a range at: it is answered with
        // an empty stream, and the connection has nothing more to do
        if (stat.size === 0 && first === 0) {
            const out = new stream.Readable({read: () => out.push(null)});
            out.content_range = {type: 'bytes', first: null, last: null, total: 0};
            out.total = 0;
            conn.destroy();
            return out;
        }

        // Only a range that starts outside the file is refused
        if (first < 0 || first >= stat.size) {
            throw new Error(`Invalid range: [first=${first}][last=${last}][total=${stat.size}]`);
        }

        // A range that ends past the file is cut to its last byte, as an
        // http server answers one: a caller may ask before it knows the size
        const actual_last = last >= stat.size ? stat.size - 1 : last;

        const out = sftp.createReadStream(pathname, {start: first, end: actual_last})
        out.content_range = {
            type: 'bytes',
            first,
            last: actual_last,
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
