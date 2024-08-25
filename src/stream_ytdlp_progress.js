const format_bytes = require('./format_bytes');
const format_percents = require('./format_percents');
const parse_bytes = require('./parse_bytes');
const stream = require('stream');
const stream_filter = require('./stream_filter');
const stream_lines = require('./stream_lines');
const stream_map = require('./stream_map');

function stream_ytdlp_progress()
{
    let current_part = 1;
    const downloading_formats = [];
    return stream.compose(
        stream_lines(),
        stream_map(function (line) {
            let m;
            if (m = line.match(/^\[info] \S+: Downloading \d+ format\(s\): (.+)$/)) {
                downloading_formats.push(...m[1].split('+'));
                return false;
            }
            if (m = line.match(/^\[download] Destination: .*f(\d+)\.[^.]+/)) {
                current_part = downloading_formats.indexOf(m[1]) + 1;
                return false;
            }
            if (m = line.match(/^\[download] (.*) of (.*) at (.*) ETA (.*)$/)) {
                const percentage = parseFloat(m[1].trim())/100;
                const total = parse_bytes(m[2].trim());
                const speed = m[3].trim().replace('i', '');
                const eta = m[4].trim();
                return {current_part, total_parts: downloading_formats.length,
                    perc: format_percents(percentage), done: format_bytes(percentage*total),
                    total: format_bytes(total), speed, eta};
            }
            return false;
        }),
        stream_filter(v => v),
    );
}

module.exports = stream_ytdlp_progress;
