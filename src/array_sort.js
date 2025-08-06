const fcmp_default = require('./fcmp_default');
const identity = require('./identity');

/**
 * Sorts an array in place by the result of applying `fn` to each item,
 * using `fcmp` to compare the results.
 */
function array_sort(array, fn = identity, fcmp = fcmp_default)
{
    const keys = new Map();
    return array.sort(function (a, b) {
        if (!keys.has(a)) {
            keys.set(a, fn(a));
        }
        if (!keys.has(b)) {
            keys.set(b, fn(b));
        }
        return fcmp(keys.get(a), keys.get(b));
    });
}

// function array_sort(array, fn = identity, fcmp = fcmp_default)
// {
//     return array.sort(function (a, b) {
//         return fcmp(fn(a), fn(b));
//     });
// }

module.exports = array_sort;
