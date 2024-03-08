const const_type = require('./const_type');

/**
 *
 * @param value
 * @return {"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"|string}
 */
function gettype(value)
{
    if (value === null) {
        return const_type.null;
    }
    if (Array.isArray(value)) {
        return const_type.array;
    }
    if (Number.isNaN(value)) {
        return const_type.nan;
    }
    if (value === Number.NEGATIVE_INFINITY) {
        return const_type.neg_inf;
    }
    if (value === Number.POSITIVE_INFINITY) {
        return const_type.pos_inf;
    }
    return typeof value;
}

module.exports = gettype;
