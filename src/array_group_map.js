/**
 * Group items by common key and return an object of items grouped by key.
 *
 * @param array
 * @param read
 * @returns {{}}
 */
function array_group_map(array, read)
{
    const out = {};
    array.forEach(function (item) {
        const key = read(item);
        out[key] = out[key] || {key, items: []};
        out[key].items.push(item);
    });
    return out;
}

module.exports = array_group_map;
