const format_progress = require('./format_progress');
const make_progress = require('./make_progress');
const stream = require('stream');

/**
 * Monitor the progress of data through a pipe. Similar to UNIX `pv` command.
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
        destroy: function (error, next) {
            tick();
            clearInterval(timer);
            next();
        },
        transform: function (buf, encoding, next) {
            if (objectMode) {
                done++;
                this.push(buf);
            }
            else {
                done += buf.length;
                this.push(buf, encoding);
            }
            next();
        },
    });
    function tick() {
        progress.update(done);
        user_friendly_status(format_progress(progress));
    }
}

module.exports = stream_progress;
