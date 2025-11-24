const factorize_ms = require('./factorize_ms');

/**
 * Format milliseconds
 */
function format_ms3(ms, include_zero_hours = false)
{
    if (!ms) {
        ms = 0;
    }

    // 00:05.445
    const [h, m, s, xx] = factorize_ms(ms);
    if (h || include_zero_hours) {
        return `0${h}:0${m}:0${s}.00${xx}`.replace(/0+(?=\d\d+[:.]|\d\d\d)/g, '');
    }
    return `0${m}:0${s}.00${xx}`.replace(/0+(?=\d\d+[:.]|\d\d\d)/g, '')
}

module.exports = format_ms3;
