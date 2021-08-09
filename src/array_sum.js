import identity from './identity';

function array_sum(array, fn = identity)
{
    let out = 0;
    array.forEach(function (item) {
        out += fn(item);
    });
    return out;
}

export default array_sum;
