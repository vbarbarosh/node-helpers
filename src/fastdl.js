const UserFriendlyError = require('./errors/UserFriendlyError');
const assert_positive_integer = require('./assert_positive_integer');
const format_bytes = require('./format_bytes');
const format_progress_bytes = require('./format_progress_bytes');
const format_thousands = require('./format_thousands');
const fs = require('fs');
const fs_path_basename = require('./fs_path_basename');
const fs_rename = require('./fs_rename');
const fs_rmf = require('./fs_rmf');
const fs_write = require('./fs_write');
const ignore = require('./ignore');
const make_progress = require('./make_progress');
const parallel = require('./parallel');
const random_hex = require('./random_hex');
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
    assert_positive_integer(concurrency, 'concurrency');
    const tmp_file = `${file}.${process.pid}.${random_hex(8)}.tmp`;
    try {
        user_friendly_status(`Preparing destination file [${fs_path_basename(file)}]...`);
        await fs_write(tmp_file, '', {flag: 'wx'});
        await download({
            concurrency,
            file: tmp_file,
            read_stream_with_range,
            user_friendly_status,
        });
        await fs_rename(tmp_file, file);
    }
    finally {
        await fs_rmf(tmp_file);
    }
}

async function download({file, read_stream_with_range, concurrency, user_friendly_status})
{
    const M = 1024*1024;
    const chunk_min_bytes = M;
    const chunk_max_bytes = 50*M;
    const active_streams = new Set();
    const writers = new Set();

    user_friendly_status('Requesting first chunk to determine total size...');
    const rs0 = await read_stream_with_range(0, chunk_min_bytes);

    const total = rs0.content_range.total;
    if (!Number.isInteger(total)) {
        rs0.once('error', ignore);
        rs0.destroy();
        throw new UserFriendlyError('Server did not return the resource size (it may have ignored the Range header)');
    }
    const chunk_size = Math.max(chunk_min_bytes, Math.min(chunk_max_bytes, Math.trunc(total/concurrency)));
    const progress = make_progress(total);

    let connections = 0;
    let next_first = 0;
    let total_written = 0;
    let rs0_used = false;

    let timer = null;
    function tick() {
        progress.refresh();
        user_friendly_status(`${format_progress_bytes(progress)} connections=${connections}`);
    }

    user_friendly_status(`${format_bytes(total)} [${format_thousands(total)} bytes] to download`);

    try {
        timer = setInterval(tick, 1000);
        await parallel({concurrency, spawn});
    }
    catch (error) {
        active_streams.forEach(v => v.destroy(error));
        await Promise.all([...writers].map(v => v.catch(ignore)));
        throw error;
    }
    finally {
        tick();
        clearInterval(timer);
    }

    if (total !== total_written) {
        throw new UserFriendlyError(`Total bytes written differs from expected size of a file: total[${total}] - total_written[${total_written}] = ${total - total_written}`);
    }

    function spawn() {
        if (next_first >= total) {
            return;
        }
        let first = next_first;
        const last = Math.min(total - 1, first + (first === 0 ? rs0.content_range.last : chunk_size));
        next_first = last + 1;
        connections++;
        const writer = Promise.resolve(run()).catch(run).catch(run).finally(function () {
            connections--;
            writers.delete(writer);
        });
        writers.add(writer);
        return writer;
        async function run() {
            if (first > last) {
                return;
            }
            const rs = (first === 0 && !rs0_used) ? rs0 : await read_stream_with_range(first, last);
            rs0_used = rs0_used || (rs === rs0);
            if (rs.content_range.total !== total) {
                rs.once('error', ignore);
                rs.destroy();
                throw new UserFriendlyError('Size of a file changed during download');
            }
            let counted = 0;
            const acc = new stream.PassThrough({
                transform(buf, encoding, next) {
                    counted += buf.length;
                    total_written += buf.length;
                    progress.add(buf.length);
                    next(null, buf);
                }
            });
            const ws = fs.createWriteStream(file, {
                flags: fs.constants.O_WRONLY, // |fs.constants.O_CREAT,
                flush: true,
                start: first,
            });
            active_streams.add(rs);
            active_streams.add(ws);
            try {
                await stream.promises.pipeline(rs, acc, ws);
            }
            catch (error) {
                // Counted bytes may not have reached the disk; retry rewrites the chunk from its start
                total_written -= counted;
                progress.add(-counted);
                throw error;
            }
            finally {
                active_streams.delete(rs);
                active_streams.delete(ws);
            }
        }
    }
}

module.exports = fastdl;
