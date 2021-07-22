import fcmp_strings from './fcmp_strings';

/**
 * Sort items in an `array` at the same order as in `other`. Values which
 * are not in `other` are added to the end in the order defined by `fcmp`.
 *
 * @param array
 * @param key_from_item
 * @param other
 * @param fcmp
 * @returns {*}
 */

function array_sort_by_other(array, key_from_item, other, fcmp = fcmp_strings)
{
    const other_map = {};
    other.forEach((v,i) => other_map[v] = i + 1);
    return array.sort(function (a, b) {
        const ax = other_map[key_from_item(a)];
        const bx = other_map[key_from_item(b)];
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

export default array_sort_by_other;
