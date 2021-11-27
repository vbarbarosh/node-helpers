function array_index(array, fn)
{
    const out = {};
    array.forEach((v,i) => out[v] = fn(v, i, array, out));
    return out;
}

export default array_index;
