const fcmp_default = require('./fcmp_default');

/**
 * Sort items in an `array` at the same order as in `other`. Values which
 * are not in the `other` are added to the end of the result defined by `fcmp`.
 *
 * @param array
 * @param fn
 * @param other
 * @param fcmp
 * @returns {*}
 */
function array_sort_other(array, fn, other, fcmp = fcmp_default)
{
    const other_map = {};
    other.forEach((v,i) => other_map[v] = i + 1);
    return array.sort(function (a, b) {
        const ax = other_map[fn(a)];
        const bx = other_map[fn(b)];
        if (ax && bx) {
            return ax - bx;
        }
        if (ax) {
            return -1;
        }
        if (bx) {
            return 1;
        }
        return fcmp(a, b);
    });
}

module.exports = array_sort_other;
