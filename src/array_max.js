const identity = require('./identity');

/**
 * Returns the first element in the array with the maximal weight
 */
function array_max(array, fn = identity)
{
    let out = null;
    let max = Number.NEGATIVE_INFINITY;
    array.forEach(function (item) {
        const weight = fn(item);
        if (max < weight) {
            max = weight;
            out = item;
        }
    });
    return out;
}

module.exports = array_max;
