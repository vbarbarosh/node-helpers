const format_bytes = require('./format_bytes');
const format_percents = require('./format_percents');
const parse_bytes = require('./parse_bytes');
const stream = require('stream');
const stream_filter = require('./stream_filter');
const stream_lines = require('./stream_lines');
const stream_map = require('./stream_map');

// [download]   0.0% of   15.71MiB at  Unknown B/s ETA Unknown
// [download]   0.0% of   15.71MiB at  Unknown B/s ETA Unknown
// [download]   0.0% of   15.71MiB at  Unknown B/s ETA Unknown
// [download]   0.1% of   15.71MiB at  Unknown B/s ETA Unknown
// [download]   0.2% of   15.71MiB at   21.76MiB/s ETA 00:00
// [download]   0.4% of   15.71MiB at   16.48MiB/s ETA 00:00
// [download]   0.8% of   15.71MiB at   25.54MiB/s ETA 00:00
// [download]   1.6% of   15.71MiB at   30.65MiB/s ETA 00:00
// [download]   3.2% of   15.71MiB at   42.99MiB/s ETA 00:00
// [download]   6.4% of   15.71MiB at   66.25MiB/s ETA 00:00
// [download]  12.7% of   15.71MiB at   81.24MiB/s ETA 00:00
// [download]  25.5% of   15.71MiB at   55.11MiB/s ETA 00:00
// [download]  50.9% of   15.71MiB at   33.83MiB/s ETA 00:00
// [download]  61.7% of   15.71MiB at   33.98MiB/s ETA 00:00
// [download]  61.7% of   15.71MiB at  Unknown B/s ETA Unknown
// [download]  61.7% of   15.71MiB at  Unknown B/s ETA Unknown
// [download]  61.7% of   15.71MiB at  Unknown B/s ETA Unknown
// [download]  61.8% of   15.71MiB at  Unknown B/s ETA Unknown
// [download]  61.9% of   15.71MiB at   12.32MiB/s ETA 00:00
// [download]  62.1% of   15.71MiB at   14.26MiB/s ETA 00:00
// [download]  62.5% of   15.71MiB at   25.10MiB/s ETA 00:00
// [download]  63.3% of   15.71MiB at   34.18MiB/s ETA 00:00
// [download]  64.9% of   15.71MiB at    8.95MiB/s ETA 00:00
// [download]  68.1% of   15.71MiB at   16.75MiB/s ETA 00:00
// [download]  74.4% of   15.71MiB at   29.10MiB/s ETA 00:00
// [download]  87.2% of   15.71MiB at   40.45MiB/s ETA 00:00
// [download] 100.0% of   15.71MiB at   47.64MiB/s ETA 00:00
// [download] 100% of   15.71MiB in 00:00:00 at 29.07MiB/s
// [Merger] Merging formats into "xxxxxxxxxxxxxxx.webm"
// Deleting original file xxxxxxxxxxxxxxx.f251.webm (pass -k to keep)
// Deleting original file xxxxxxxxxxxxxxx.f248.webm (pass -k to keep)

function stream_ytdlp_progress()
{
    let last = {};
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
            if (m = line.match(/^\[Merger]/i)) {
                last.merging = true;
                return last;
            }
            if (m = line.match(/^\[download] (.*) of (.*) at (.*) ETA (.*)$/)) {
                const percentage = parseFloat(m[1].trim())/100;
                const total = parse_bytes(m[2].trim());
                const speed = m[3].trim().replace('i', '');
                const eta = m[4].trim();
                return last = {
                    current_part,
                    total_parts: downloading_formats.length,
                    perc: format_percents(percentage),
                    done: format_bytes(percentage*total),
                    total: format_bytes(total),
                    speed: speed.toLowerCase().includes('unknown') ? '~' : speed,
                    eta: eta.toLowerCase().includes('unknown') ? '~' : eta,
                    merging: false,
                };
            }
            return false;
        }),
        stream_filter(v => v),
    );
}

module.exports = stream_ytdlp_progress;
