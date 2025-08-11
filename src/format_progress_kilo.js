const format_kilo = require('./format_kilo');
const format_percents = require('./format_percents');
const format_seconds = require('./format_seconds');
const is_num_gt = require('@vbarbarosh/type-helpers/src/is_num_gt');

function format_progress_kilo({percents, total, done, rate, eta, duration})
{
    const speed = is_num_gt(rate, 0) ? `${format_kilo(rate)}/s` : '~';
    if (done > total) {
        return `${format_kilo(done)} at ${speed} duration=${format_seconds(duration)}`;
    }
    if (is_num_gt(total, 0)) {
        const eta_str = is_num_gt(eta, 0) ? format_seconds(eta) : '~';
        return `${format_percents(percents)} | ${format_kilo(done)} of ${format_kilo(total)} at ${speed} ETA ${eta_str} duration=${format_seconds(duration)}`;
    }
    if (is_num_gt(done, 0)) {
        return `${format_kilo(done)} of ~ at ${speed} duration=${format_seconds(duration)}`;
    }
    if (is_num_gt(duration, 0)) {
        return `~ duration=${format_seconds(duration)}`;
    }
    return '~';
}

module.exports = format_progress_kilo;
