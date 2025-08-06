const identity = require('./identity');

/**
 * Return unique values; if a value occurs multiple times, keep the first one.
 */
function array_unique(values, fn = identity)
{
    const set = new Set();
    return values.filter(function (item) {
        const key = fn(item);
        if (set.has(key)) {
            return false;
        }
        set.add(key);
        return true;
    });
}

module.exports = array_unique;
