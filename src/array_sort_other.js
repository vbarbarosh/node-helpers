const fcmp_default = require('./fcmp_default');

/**
 * Sort items in an `array` at the same order as in `other`. Values which
 * are not in the `other` are added to the end of the result defined by `fcmp`.
 *
 * @param array
 * @param read
 * @param other
 * @param fcmp
 * @returns {*}
 */
function array_sort_other(array, read, other, fcmp = fcmp_default)
{
    // No-prototype object: with a plain {} the keys 'constructor',
    // 'toString', '__proto__', ... would collide with Object.prototype
    // members and corrupt the sort order.
    const other_map = Object.create(null);
    other.forEach((v,i) => other_map[v] = i + 1);
    return array.sort(function (a, b) {
        const ax = other_map[read(a)];
        const bx = other_map[read(b)];
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
