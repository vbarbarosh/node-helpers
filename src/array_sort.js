const fcmp_default = require('./fcmp_default');
const fcmp_tuples = require('./fcmp_tuples');

/**
 * Sorts an array in place by the result of applying `fn` to each item,
 * using `fcmp` to compare the results.
 *
 * array_sort(items, v => v.name)
 * array_sort(items, v => [v.name])
 * array_sort(items, v => [v.age, v.name])
 */
function array_sort(array, mapper, fcmp = fcmp_default)
{
    const keys = new Map();
    return array.sort(function (a, b) {
        // A scalar key is a 1-tuple: fcmp_tuples on scalars would compare
        // nothing and silently leave the array unsorted
        if (!keys.has(a)) {
            const key = mapper(a);
            keys.set(a, Array.isArray(key) ? key : [key]);
        }
        if (!keys.has(b)) {
            const key = mapper(b);
            keys.set(b, Array.isArray(key) ? key : [key]);
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
