const format_bytes = require('./format_bytes');
const format_seconds = require('./format_seconds');
const format_thousands = require('./format_thousands');
const fs = require('fs');
const make_progress = require('./progress');
const parallel = require('./parallel');
const stream = require('stream');

/**
 * Download a file in several connections in parallel.
 *
 * await fastdl({
 *     file: fs_path_basename(new URL(url).pathname),
 *     read_stream_with_range: (first, last) => http_get_stream_range(url, first, last),
 * });
 */
async function fastdl({file, read_stream_with_range, concurrency = 60, log = v => console.log(v)})
{
    const M = 1024*1024;
    const chunk_min_bytes = M;
    const chunk_max_bytes = 50*M;

    log(`Truncating destination file [${file}]...`);
    await fs.promises.writeFile(file, '');

    log('Requesting first chunk to determine total size...');
    const rs0 = await read_stream_with_range(0, chunk_min_bytes);

    const total = rs0.content_range.total;
    const chunk_size = Math.max(chunk_min_bytes, Math.min(chunk_max_bytes, Math.trunc(total/concurrency)));
    const progress = make_progress(total);

    let connections = 0;
    let next_first = 0;
    let total_written = 0;

    const timer = setInterval(tick, 1000);
    function tick() {
        const p = progress;
        const bb = format_bytes;
        const ss = format_seconds;
        log(`${bb(p.done)} of ${bb(p.total)} ${(p.percentage*100).toFixed(2)}% at ${bb(p.rate)}/s ETA ${ss(p.eta)} duration=${ss(p.duration)} connections=${connections}`);
    }

    log(`${format_bytes(total)} [${format_thousands(total)} bytes] to download`);

    try {
        await parallel({concurrency, spawn});
    }
    finally {
        tick();
        clearInterval(timer);
    }

    if (total !== total_written) {
        throw new Error(`Total bytes written differs from size of a file: total[${total}] - total_written[${total_written}] = ${total - total_written}`);
    }

    function spawn() {
        if (next_first >= total) {
            return;
        }
        const first = next_first;
        const last = Math.min(total - 1, first + (first === 0 ? rs0.content_range.last : chunk_size));
        next_first = last + 1;
        connections++;
        return Promise.resolve(run()).finally(() => connections--);
        async function run() {
            const rs = (first === 0) ? rs0 : await read_stream_with_range(first, last);
            const acc = new stream.PassThrough({
                transform(buf, enc, cb) {
                    total_written += buf.length;
                    progress.add(buf.length);
                    cb(null, buf);
                }
            });
            const ws = fs.createWriteStream(file, {
                flags: fs.constants.O_WRONLY, // |fs.constants.O_CREAT,
                start: first,
            });
            await stream.promises.pipeline(rs, acc, ws);
        }
    }
}

module.exports = fastdl;
