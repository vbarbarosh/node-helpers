const fcmp_default = require('./fcmp_default');
const fcmp_tuples = require('./fcmp_tuples');

/**
 * Sorts an array in place by the result of applying `fn` to each item,
 * using `fcmp` to compare the results.
 *
 * array_sort(items, v => [v.name])
 * array_sort(items, v => [v.age, v.name])
 */
function array_sort(array, mapper, fcmp = fcmp_default)
{
    const keys = new Map();
    return array.sort(function (a, b) {
        if (!keys.has(a)) {
            keys.set(a, mapper(a));
        }
        if (!keys.has(b)) {
            keys.set(b, mapper(b));
        }
        return fcmp_tuples(keys.get(a), keys.get(b), fcmp);
    });
}

// function array_sort(array, fn = identity, fcmp = fcmp_default)
// {
//     return array.sort(function (a, b) {
//         return fcmp(fn(a), fn(b));
//     });
// }

module.exports = array_sort;
