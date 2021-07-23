import fcmp_strings from './fcmp_strings';

/**
 * Sort items in an `array`.
 *
 * @param array
 * @param fn
 * @param fcmp
 * @returns {*}
 */
function array_sort(array, fn = identity, fcmp = fcmp_strings)
{
    return array.sort(function (a, b) {
        return fcmp(fn(a), fn(b));
    });
}

function identity(v)
{
    return v;
}

export default array_sort;
