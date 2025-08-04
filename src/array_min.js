/**
 * Returns the first element in the array with the minimal weight
 */
function array_min(array, fn = identity)
{
    let out = null;
    let min = Number.POSITIVE_INFINITY;
    array.forEach(function (item) {
        const weight = fn(item);
        if (min > weight) {
            min = weight;
            out = item;
        }
    });
    return out;
}

function identity(value)
{
    return value;
}

module.exports = array_min;
