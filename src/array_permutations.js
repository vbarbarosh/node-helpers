// https://stackoverflow.com/a/37580979/23502239
function array_permutations(array)
{
    var length = array.length,
        out = [array.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = array[i];
            array[i] = array[k];
            array[k] = p;
            ++c[i];
            i = 1;
            out.push(array.slice());
        }
        else {
            c[i] = 0;
            ++i;
        }
    }
    return out;
}

module.exports = array_permutations;
