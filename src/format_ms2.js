const factorize_ms = require('./factorize_ms');

/**
 * Format milliseconds
 */
function format_ms3(ms)
{
    if (!ms) {
        ms = 0;
    }

    // 00:05.45
    const [h, m, s, xx] = factorize_ms(ms);
    if (h) {
        return `0${h}:0${m}:0${s}.0${Math.round(xx/10)}`.replace(/0+(?=\d\d)/g, '');
    }
    return `0${m}:0${s}.00${Math.round(xx/10)}`.replace(/0+(?=\d\d)/g, '');
}

module.exports = format_ms3;
