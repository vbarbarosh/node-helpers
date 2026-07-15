const assert = require('assert');
const fcmp_default = require('./fcmp_default');
const fcmp_default_desc = require('./fcmp_default_desc');

const items = [
    // [a, b, expected sign]
    [1, 2, 1],
    [2, 1, -1],
    [1, 1, 0],
    [-1, 1, 1],
    ['a', 'b', 1],
    ['b', 'a', -1],
    ['a', 'a', 0],
    ['2', '10', 1], // natural order, descending
];

describe('fcmp_default_desc', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${JSON.stringify(a)} vs ${JSON.stringify(b)} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_default_desc(a, b)), expected);
        });
    });
    it('should be the mirror of fcmp_default', function () {
        items.forEach(function ([a, b]) {
            assert.strictEqual(fcmp_default_desc(a, b), fcmp_default(b, a));
        });
    });
    it('should sort numbers in descending order', function () {
        assert.deepStrictEqual([1, 10, 2, 9].sort(fcmp_default_desc), [10, 9, 2, 1]);
    });
    it('should sort strings in descending order', function () {
        assert.deepStrictEqual(['banana', 'apple', 'cherry'].sort(fcmp_default_desc), ['cherry', 'banana', 'apple']);
    });
    it('should sort digit-bearing strings naturally, descending', function () {
        assert.deepStrictEqual(['file1', 'file10', 'file2'].sort(fcmp_default_desc), ['file10', 'file2', 'file1']);
    });
    it('should return 0 for incomparable values', function () {
        assert.strictEqual(fcmp_default_desc(NaN, 1), 0);
        assert.strictEqual(fcmp_default_desc(undefined, 1), 0);
    });
});
