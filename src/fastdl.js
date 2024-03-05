const format_bytes = require('./format_bytes');
const format_progress = require('./format_progress');
const format_thousands = require('./format_thousands');
const fs = require('fs');
const fs_path_basename = require('./fs_path_basename');
const make_progress = require('./make_progress');
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
async function fastdl({file, read_stream_with_range, concurrency = 60, user_friendly_status = v => console.log(v)})
{
    const M = 1024*1024;
    const chunk_min_bytes = M;
    const chunk_max_bytes = 50*M;

    user_friendly_status(`Truncating destination file [${fs_path_basename(file)}]...`);
    await fs.promises.writeFile(file, '');

    user_friendly_status('Requesting first chunk to determine total size...');
    const rs0 = await read_stream_with_range(0, chunk_min_bytes);

    const total = rs0.content_range.total;
    const chunk_size = Math.max(chunk_min_bytes, Math.min(chunk_max_bytes, Math.trunc(total/concurrency)));
    const progress = make_progress(total);

    let connections = 0;
    let next_first = 0;
    let total_written = 0;

    const timer = setInterval(tick, 1000);
    function tick() {
        progress.refresh();
        user_friendly_status(`${format_progress(progress)} connections=${connections}`);
    }

    user_friendly_status(`${format_bytes(total)} [${format_thousands(total)} bytes] to download`);

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
        let first = next_first;
        const last = Math.min(total - 1, first + (first === 0 ? rs0.content_range.last : chunk_size));
        next_first = last + 1;
        connections++;
        return Promise.resolve(run()).catch(run).catch(run).finally(() => connections--);
        async function run() {
            if (first > last) {
                return;
            }
            const rs = (first === 0) ? rs0 : await read_stream_with_range(first, last);
            const acc = new stream.PassThrough({
                transform(buf, encoding, next) {
                    first += buf.length;
                    total_written += buf.length;
                    progress.add(buf.length);
                    next(null, buf);
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
