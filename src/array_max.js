const identity = require('./identity');

/**
 * Returns the first element in the array with the maximal weight
 */
function array_max(array, read = identity)
{
    let out = null;
    let max = null;
    let seeded = false;
    array.forEach(function (item) {
        const weight = read(item);
        // NaN compares false with everything: seeding max with it would
        // make every subsequent comparison fail
        if (Number.isNaN(weight)) {
            return;
        }
        if (!seeded || max < weight) {
            seeded = true;
            max = weight;
            out = item;
        }
    });
    return out;
}

module.exports = array_max;
