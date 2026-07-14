const identity = require('./identity');

/**
 * Return unique values; if a value occurs multiple times, keep the last one.
 */
function array_unique_last(array, read = identity)
{
    const out = [];
    const set = new Set();
    for (let i = array.length; --i >= 0; ) {
        const item = array[i];
        const key = read(item);
        if (!set.has(key)) {
            set.add(key);
            out.push(item);
        }
    }
    return out.reverse();
}

module.exports = array_unique_last;
