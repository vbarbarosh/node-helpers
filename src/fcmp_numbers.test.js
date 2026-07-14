const assert = require('assert');
const fcmp_numbers = require('./fcmp_numbers');

const items = [
    // [a, b, expected sign]
    [1, 2, -1],
    [2, 1, 1],
    [1, 1, 0],
    [-5, 3, -1],
    [0.1, 0.2, -1],
    [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, -1],
    [-Infinity, 1, -1],
    [Infinity, 1, 1],
];

describe('fcmp_numbers', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${a} vs ${b} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_numbers(a, b)), expected);
        });
    });
    it('should sort numbers numerically (unlike the default [].sort)', function () {
        assert.deepStrictEqual([10, 9, 1, 100, 2].sort(fcmp_numbers), [1, 2, 9, 10, 100]);
    });
    it('should return NaN when values are incomparable', function () {
        assert.ok(Number.isNaN(fcmp_numbers(NaN, 1)));
        assert.ok(Number.isNaN(fcmp_numbers(Infinity, Infinity)));
    });
});
