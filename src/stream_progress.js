const format_bytes = require('./format_bytes');
const format_percents = require('./format_percents');
const format_seconds = require('./format_seconds');
const make_progress = require('./make_progress');
const stream = require('stream');

/**
 * Monitor the progress of data through a pipe. Similar to UNIX `pv` command.
 */
function stream_progress({total, user_friendly_status})
{
    let done = 0;
    const timer = setInterval(tick, 1000);
    const progress = make_progress(total);
    return new stream.Transform({
        destroy: function (error, next) {
            tick();
            clearInterval(timer);
            next();
        },
        transform: function (buf, encoding, next) {
            done += buf.length;
            this.push(buf, encoding);
            next();
        },
    });
    function tick() {
        progress.update(done);
        user_friendly_status(`${format_percents(progress.percents)} | ${format_bytes(done)} of ${format_bytes(total)} at ${format_bytes(progress.rate)}/s ETA ${format_seconds(progress.eta)} duration=${format_seconds(progress.duration)}`);
    }
}

module.exports = stream_progress;
