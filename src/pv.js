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
        if (resumed) {
            const done = read + resumed;
            log(`${bytes(done)} of ${bytes(total)} at ${bytes(bps)}/s ETA ${eta(time0, total, done, resumed)}`);
        }
        else {
            log(`[${format_seconds(seconds)}] ${bytes(read)} at ${bytes(bps)}/s`);
        }
        yield chunk;
    }
}

module.exports = pv;
