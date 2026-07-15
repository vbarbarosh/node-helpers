const fcmp_utf8_natural_bin = require('./fcmp_utf8_natural_bin');

// See fcmp_default.md
function fcmp_default(a, b)
{
    if (typeof a === 'string' && typeof b === 'string') {
        // Natural order: '2' < '10', 'file2' < 'file10'
        return fcmp_utf8_natural_bin(a, b);
    }
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

module.exports = fcmp_default;
