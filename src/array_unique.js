const identity = require('./identity');

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
