/**
 * Group items by common key and return an object of items grouped by key.
 *
 * @param array
 * @param fn
 * @returns {{}}
 */
function array_group_map(array, fn)
{
    const out = {};
    array.forEach(function (item) {
        const key = fn(item);
        out[key] = out[key] || {key, items: []};
        out[key].items.push(item);
    });
    return out;
}

export default array_group_map;
