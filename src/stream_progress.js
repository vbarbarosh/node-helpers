const format_progress_bytes = require('./format_progress_bytes');
const format_progress_kilo = require('./format_progress_kilo');
const make_progress = require('./make_progress');
const stream = require('stream');

/**
 * Monitor the progress of data through a pipe, similar to the UNIX `pv` command.
 *
 * Requirements:
 * - should emit first message as fast as possible
 * - should always emit 100% message
 *
 * @similar https://www.npmjs.com/package/progress-stream
 */
function stream_progress({objectMode = false, interval = 1000, total, user_friendly_status = s => console.log(s)} = {})
{
    let done = 0;
    const timer = setInterval(tick, interval);
    const progress = make_progress(total);
    const format_progress = objectMode ? format_progress_kilo : format_progress_bytes;
    setTimeout(tick, 0);
    return new stream.Transform({
        objectMode,
        destroy: function (error, callback) {
            tick();
            clearInterval(timer);
            callback();
        },
        transform: function (buffer, encoding, callback) {
            if (objectMode) {
                done++;
                this.push(buffer);
            }
            else {
                done += buffer.length;
                this.push(buffer, encoding);
            }
            callback();
        },
    });
    function tick() {
        progress.update(done);
        user_friendly_status(format_progress(progress));
    }
}

module.exports = stream_progress;
