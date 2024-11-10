const format_bytes = require('./format_bytes');
const format_percents = require('./format_percents');
const format_seconds = require('./format_seconds');
const is_number_gt = require('./is_number_gt');

function format_progress_bytes({percents, total, done, rate, eta, duration})
{
    const bps = is_number_gt(rate, 0) ? `${format_bytes(rate)}/s` : '~';
    if (done > total) {
        return `${format_bytes(done)} at ${bps} duration=${format_seconds(duration)}`;
    }
    if (is_number_gt(total, 0)) {
        const eta_str = is_number_gt(eta, 0) ? format_seconds(eta) : '~';
        return `${format_percents(percents)} | ${format_bytes(done)} of ${format_bytes(total)} at ${bps} ETA ${eta_str} duration=${format_seconds(duration)}`;
    }
    if (is_number_gt(done, 0)) {
        return `${format_bytes(done)} of ~ at ${bps} duration=${format_seconds(duration)}`;
    }
    if (is_number_gt(duration, 0)) {
        return `~ duration=${format_seconds(duration)}`;
    }
    return '~';
}

module.exports = format_progress_bytes;
