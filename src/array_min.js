const identity = require('./identity');

/**
 * Returns the first element in the array with the minimal weight
 */
function array_min(array, fn = identity)
{
    let out = null;
    let min = null;
    let seeded = false;
    array.forEach(function (item) {
        const weight = fn(item);
        // NaN compares false with everything: seeding min with it would
        // make every subsequent comparison fail
        if (Number.isNaN(weight)) {
            return;
        }
        if (!seeded || min > weight) {
            seeded = true;
            min = weight;
            out = item;
        }
    });
    return out;
}

module.exports = array_min;
