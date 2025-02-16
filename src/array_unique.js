function array_unique(values)
{
    const set = new Set();
    return values.filter(function (item) {
        if (set.has(item)) {
            return false;
        }
        set.add(item);
        return true;
    });
}

module.exports = array_unique;
