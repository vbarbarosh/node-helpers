function array_index(array, fn)
{
    const out = {};
    array.forEach(v => out[fn(v)] = v);
    return out;
}

module.exports = array_index;
