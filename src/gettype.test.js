const assert = require('assert');
const const_type = require('./const_type');
const gettype = require('./gettype');

const items = [
    ['null', null, const_type.null],
    ['undefined', undefined, const_type.undefined],
    ['boolean', true, const_type.boolean],
    ['number', 1, const_type.number],
    ['bigint', 1n, const_type.bigint],
    ['nan', NaN, const_type.nan],
    ['-inf', Number.NEGATIVE_INFINITY, const_type.neg_inf],
    ['+inf', Number.POSITIVE_INFINITY, const_type.pos_inf],
    ['string', 's', const_type.string],
    ['symbol', Symbol(), const_type.symbol],
    ['function', () => 1, const_type.function],
    ['object', {}, const_type.object],
    ['array', [], const_type.array],
];

describe('gettype', function () {
    items.forEach(function ([title, input, expected]) {
        it(title, function () {
            assert.deepStrictEqual(gettype(input), expected);
        });
    });
});
