const assert = require('assert');
const fcmp_default = require('./fcmp_default');

const items = [
    // [a, b, expected sign]
    [1, 2, -1],
    [2, 1, 1],
    [1, 1, 0],
    [-1, 1, -1],
    [1.5, 1.25, 1],
    ['a', 'b', -1],
    ['b', 'a', 1],
    ['a', 'a', 0],
    ['a', 'ab', -1],
    ['10', '9', -1], // strings compare by code units, not numerically
];

describe('fcmp_default', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${JSON.stringify(a)} vs ${JSON.stringify(b)} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_default(a, b)), expected);
        });
    });
    it('should sort numbers numerically (unlike the default [].sort)', function () {
        assert.deepStrictEqual([10, 9, 1, 2].sort(fcmp_default), [1, 2, 9, 10]);
    });
    it('should sort strings in ascending order', function () {
        assert.deepStrictEqual(['banana', 'apple', 'cherry'].sort(fcmp_default), ['apple', 'banana', 'cherry']);
    });
    it('should return 0 for incomparable values', function () {
        assert.strictEqual(fcmp_default(NaN, 1), 0);
        assert.strictEqual(fcmp_default(undefined, 1), 0);
    });
});
