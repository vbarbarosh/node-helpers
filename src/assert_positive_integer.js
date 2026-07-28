const is_num_gt = require('@vbarbarosh/type-helpers/src/is_num_gt');

function assert_positive_integer(value, name = 'value')
{
    if (!is_num_gt(value, 0) || !Number.isInteger(value)) {
        throw new Error(`[${name}] should be a positive integer.`);
    }
}

module.exports = assert_positive_integer;
