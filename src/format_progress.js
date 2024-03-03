const format_bytes = require('./format_bytes');
const format_percents = require('./format_percents');
const format_seconds = require('./format_seconds');

function format_progress({percents, total, done, rate, eta, duration})
{
    if (total) {
        return `${format_percents(percents)} | ${format_bytes(done)} of ${format_bytes(total)} at ${format_bytes(rate)}/s ETA ${format_seconds(eta)} duration=${format_seconds(duration)}`;
    }
    return `${format_bytes(done)} of ~ at ${format_bytes(rate)}/s duration=${format_seconds(duration)}`;
}

module.exports = format_progress;
