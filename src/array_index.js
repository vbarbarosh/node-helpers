function array_index(array, fn)
{
    const out = {};
    array.forEach(v => out[fn(v)] = v);
    return out;
}

export default array_index;
