const fcmp_default = require('./fcmp_default');

function fcmp_tuples(a, b, fcmp = fcmp_default)
{
    const end = Math.min(a.length, b.length);
    for (let i = 0; i < end; ++i) {
        const tmp = fcmp(a[i], b[i]);
        if (tmp) {
            return tmp;
        }
    }
    return 0;
}

module.exports = fcmp_tuples;
