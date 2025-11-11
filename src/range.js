const na = Symbol();

function range(begin, end = na, step = 1, limit = 1E6)
{
    if (end === na) {
        if (begin < 0) {
            return [];
        }
        return range_forward(0, begin, 1, limit);
    }

    if (begin < end) {
        return range_forward(begin, end, step, limit);
    }
    return range_backward(begin, end, step, limit);
}

function range_forward(begin, end, step, limit)
{
    if (step < 0) {
        return [];
    }

    const out = [];
    for (let value = begin; value < end && out.length < limit; value += step) {
        out.push(value);
    }
    return out;
}

function range_backward(begin, end, step, limit)
{
    if (step > 0) {
        return [];
    }

    const out = [];
    for (let value = begin; value > end && out.length < limit; value += step) {
        out.push(value);
    }
    return out;
}

export default range;
