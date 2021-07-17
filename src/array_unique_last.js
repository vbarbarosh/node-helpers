/**
 * Return only unique values. If there are many values - prefer last one.
 *
 * @param array
 * @param fn
 * @returns {*[]}
 */
function array_unique_last(array, fn = identity)
{
    const out = [];
    const taken = {};
    for (let i = array.length; --i >= 0; ) {
        const item = array[i];
        const pk = fn(item);
        if (!taken[pk]) {
            taken[pk] = true;
            out.push(item);
        }
    }
    return out.reverse();
}

function identity(value)
{
    return value;
}

export default array_unique_last;
