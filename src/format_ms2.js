const factorize_ms = require('./factorize_ms');

/**
 * Format milliseconds
 */
function format_ms2(ms)
{
    if (!ms) {
        ms = 0;
    }

    // 00:05.45
    // Round to centiseconds before factorizing so the carry propagates:
    // rounding the factorized remainder would turn 5999 into "00:05.100"
    const sign = ms < 0 ? '-' : '';
    const [h, m, s, xx] = factorize_ms(Math.round(Math.abs(ms)/10)*10);
    if (h) {
        return sign + `0${h}:0${m}:0${s}.0${xx/10}`.replace(/0+(?=\d\d)/g, '');
    }
    return sign + `0${m}:0${s}.0${xx/10}`.replace(/0+(?=\d\d)/g, '');
}

module.exports = format_ms2;
