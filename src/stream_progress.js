const format_progress_bytes = require('./format_progress_bytes');
const make_progress = require('./make_progress');
const stream = require('stream');

/**
 * Monitor the progress of data through a pipe, similar to the UNIX `pv` command.
 *
 * @similar https://www.npmjs.com/package/progress-stream
 */
function stream_progress({objectMode = false, total, user_friendly_status = s => console.log(s)} = {})
{
    let done = 0;
    const timer = setInterval(tick, 1000);
    const progress = make_progress(total);
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
        user_friendly_status(format_progress_bytes(progress));
    }
}

module.exports = stream_progress;
