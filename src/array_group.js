/**
 * Group items by a common key and return an array of groups.
 *
 * @alternative Map.groupBy(items, fn)
 */
function array_group(array, fn)
{
    const map = new Map();
    array.forEach(function (item) {
        const key = fn(item);
        if (!map.has(key)) {
            map.set(key, {key, items: []});
        }
        map.get(key).items.push(item);
    });
    return map.values().toArray();
}

module.exports = array_group;
