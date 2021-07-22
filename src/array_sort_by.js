import fcmp_strings from './fcmp_strings';

/**
 * Sort items in an `array` at the same order as in `other`. Values which
 * are not in `other` are added to the end in the order defined by `fcmp`.
 *
 * @param array
 * @param key_from_item
 * @param fcmp
 * @returns {*}
 */

function array_sort_by(array, key_from_item, fcmp = fcmp_strings)
{
    return array.sort(function (a, b) {
        return fcmp(key_from_item(a), key_from_item(b));
    });
}

export default array_sort_by;
