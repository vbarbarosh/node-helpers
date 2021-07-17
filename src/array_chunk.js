/**
 * Split an array into chunks.
 *
 * @param array
 * @param limit
 * @returns {*[]}
 */
function array_chunk(array = [], limit = 1)
{
    if (limit < 1) {
        throw new Error('Limit value should be greater than 1');
    }

    const out = [];
    for (let i = 0, end = array.length; i < end; i += limit) {
        out.push(array.slice(i, i + limit));
    }
    return out;
}

export default array_chunk;
