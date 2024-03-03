const format_bytes = require('./format_bytes');
const format_percents = require('./format_percents');
const format_seconds = require('./format_seconds');

function format_progress({percents, total, done, rate, eta, duration})
{
    const bps = rate ? `${format_bytes(rate)}/s` : '~';
    if (total) {
        const eta_str = eta ? format_seconds(eta) : '~';
        return `${format_percents(percents)} | ${format_bytes(done)} of ${format_bytes(total)} at ${bps} ETA ${eta_str} duration=${format_seconds(duration)}`;
    }
    return `${format_bytes(done)} of ~ at ${bps} duration=${format_seconds(duration)}`;
}

module.exports = format_progress;
