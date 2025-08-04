const fcmp_strings = require('./fcmp_strings');
const identity = require('./identity');

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

module.exports = array_sort;
