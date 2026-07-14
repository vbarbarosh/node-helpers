function array_sum(array, read = Number)
{
    let out = 0;
    array.forEach(function (item) {
        out += read(item);
    });
    return out;
}

module.exports = array_sum;
