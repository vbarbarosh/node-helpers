const stream = require('stream');
const stream_filter = require('./stream_filter');
const stream_lines = require('./stream_lines');
const stream_map = require('./stream_map');

function stream_ytdlp_progress()
{
    const re = /^\[download] (.*) of (.*) at (.*) ETA (.*)$/;
    return stream.compose(
        stream_lines(),
        stream_map(function (v) {
            const m = re.exec(v);
            return !m ? false : {done: m[1].trim(), of: m[2].trim(), speed: m[3].trim(), eta: m[4].trim()};
        }),
        stream_filter(v => v),
    );
}

module.exports = stream_ytdlp_progress;
