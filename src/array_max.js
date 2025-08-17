const identity = require('./identity');

/**
 * Returns the first element in the array with the maximal weight
 */
function array_max(array, fn = identity)
{
    let out = null;
    let max = null;
    array.forEach(function (item, i) {
        const weight = fn(item);
        if (i === 0 || max < weight) {
            max = weight;
            out = item;
        }
    });
    return out;
}

module.exports = array_max;
