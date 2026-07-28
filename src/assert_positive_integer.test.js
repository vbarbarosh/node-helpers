const assert = require('assert');
const assert_positive_integer = require('./assert_positive_integer');

describe('assert_positive_integer', function () {
    [1, 2, Number.MAX_VALUE].forEach(function (value) {
        it(`should accept [${value}]`, function () {
            assert.strictEqual(assert_positive_integer(value), undefined);
        });
    });
    [undefined, null, 0, -1, NaN, Infinity, -Infinity, 1.5, '1'].forEach(function (value) {
        it(`should reject [${String(value)}]`, function () {
            assert.throws(() => assert_positive_integer(value, 'concurrency'), /\[concurrency] should be a positive integer/);
        });
    });
});
