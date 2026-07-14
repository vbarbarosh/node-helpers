/**
 * Group items by a common key and return an array of groups.
 *
 * @alternative Map.groupBy(items, read)
 */
function array_group(array, read)
{
    const map = new Map();
    array.forEach(function (item) {
        const key = read(item);
        if (!map.has(key)) {
            map.set(key, {key, items: []});
        }
        map.get(key).items.push(item);
    });
    return map.values().toArray();
}

module.exports = array_group;
