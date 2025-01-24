/**
 * Usage:
 *     array_index(items, v => v.name)
 *
 * Seems, there is a native way to do it:
 *     Object.fromEntries(items.map(v => [v.name, v]));
 */
function array_index(array, fn)
{
    const out = {};
    array.forEach(v => out[fn(v)] = v);
    return out;
}

module.exports = array_index;
