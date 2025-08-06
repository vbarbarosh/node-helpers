const identity = require('./identity');

/**
 * Returns the first element in the array with the minimal weight
 */
function array_min(array, fn = identity)
{
    let out = null;
    let min = null;
    array.forEach(function (item) {
        const weight = fn(item);
        if (min === null || min > weight) {
            min = weight;
            out = item;
        }
    });
    return out;
}

module.exports = array_min;
