/**
 * Return first among maximum values.
 *
 * @param array
 * @param fn
 */
function array_max(array, fn = identity)
{
    let out = null;
    let out_value = null;
    array.forEach(function (item) {
        const item_value = fn(item);
        if (item_value > out_value || out_value === null) {
            out = item;
            out_value = item_value;
        }
    });
    return out;
}

function identity(value)
{
    return value;
}

module.exports = array_max;
