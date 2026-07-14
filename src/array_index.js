const identity = require('./identity');

/**
 * Usage:
 *     array_index(items, v => v.name)
 *
 * Seems, there is a native way to do it:
 *     Object.fromEntries(items.map(v => [v.name, v]));
 */
function array_index(array, read = identity)
{
    const out = {};
    array.forEach(v => out[read(v)] = v);
    return out;
}

module.exports = array_index;
