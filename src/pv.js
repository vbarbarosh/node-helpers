const eta = require('./eta');
const format_bytes = require('./format_bytes');
const format_seconds = require('./format_seconds');

/**
 * Monitor the progress of data through a pipe.
 */
async function* pv(stream, {total, resumed, log = s => console.log(s)})
{
    let read = 0;
    const time0 = Date.now();
    for await (const chunk of stream) {
        read += chunk.length;
        const seconds = (Date.now() - time0)/1000;
        const bps = read/seconds;
        if (total) {
            const done = read + (resumed || 0);
            log(`${format_bytes(done)} of ${format_bytes(total)} at ${format_bytes(bps)}/s ETA ${eta(time0, total, done, resumed)}`);
        }
        else {
            log(`[${format_seconds(seconds)}] ${format_bytes(read)} at ${format_bytes(bps)}/s`);
        }
        yield chunk;
    }
}

module.exports = pv;
