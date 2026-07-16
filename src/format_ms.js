const factorize_ms = require('./factorize_ms');

/**
 * Format milliseconds
 */
function format_ms(ms)
{
    if (!ms) {
        ms = 0;
    }

    // 00:05
    const sign = ms < 0 ? '-' : '';
    const [h, m, s] = factorize_ms(ms);
    if (h) {
        return sign + `0${h}:0${m}:0${s}`.replace(/0+(?=\d\d)/g, '');
    }
    return sign + `0${m}:0${s}`.replace(/0+(?=\d\d)/g, '');
}

module.exports = format_ms;
