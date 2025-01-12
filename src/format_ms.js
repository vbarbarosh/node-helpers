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
    const [h, m, s] = factorize_ms(ms);
    if (h) {
        return `0${h}:0${m}:0${s}`.replace(/0+(?=\d\d)/g, '');
    }
    return `0${m}:0${s}`.replace(/0+(?=\d\d)/g, '');
}

module.exports = format_ms;
