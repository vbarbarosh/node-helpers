// https://stackoverflow.com/a/37580979/23502239
function array_permutations(array, k = array.length)
{
    if (k !== array.length) {
        return array_permutations_k(array, k);
    }

    let length = array.length;
    let out = [array.slice()];
    let c = new Array(length).fill(0);
    let i = 1, kk, p;

    while (i < length) {
        if (c[i] < i) {
            kk = i % 2 && c[i];
            p = array[i];
            array[i] = array[kk];
            array[kk] = p;
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

function array_permutations_k(array, k)
{
    if (k === 0) {
        return [
            []
        ];
    }
    if (array.length < k) {
        return [];
    }

    const out = [];
    for (let i = 0; i < array.length; i++) {
        const rest = array.slice(0, i).concat(array.slice(i + 1));
        for (const perm of array_permutations(rest, k - 1)) {
            out.push([array[i], ...perm]);
        }
    }
    return out;
}

module.exports = array_permutations;
