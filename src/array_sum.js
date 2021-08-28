function array_sum(array, fn = Number)
{
    let out = 0;
    array.forEach(function (item) {
        out += fn(item);
    });
    return out;
}

export default array_sum;
