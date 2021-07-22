import fcmp_strings from './fcmp_strings';

/**
 * Sort items in an `array` at the same order as in `other`. Values which
 * are not in `other` are added to the end in the order defined by `fcmp`.
 *
 * @param array
 * @param other
 * @param fcmp
 * @returns {*}
 */

function array_sort_other(array, other, fcmp = fcmp_strings)
{
    const other_map = {};
    other.forEach((v,i) => other_map[v] = i + 1);
    return array.sort(function (a, b) {
        const ax = other_map[a];
        const bx = other_map[b];
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

export default array_sort_other;
