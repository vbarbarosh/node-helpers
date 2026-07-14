const assert = require('assert');
const fcmp_tuples = require('./fcmp_tuples');

const items = [
    // [a, b, expected sign]
    [[1, 2], [1, 3], -1],
    [[1, 3], [1, 2], 1],
    [[1, 2], [1, 2], 0],
    [[2], [1, 9], 1], // the first differing position decides
    [['a', 1], ['a', 2], -1],
    [['a'], ['b'], -1],
    [[], [], 0],
    // Only the first Math.min(a.length, b.length) items are compared:
    // a shorter tuple that is a prefix of a longer one compares as equal
    [[1], [1, 2], 0],
    [[], [1, 2], 0],
];

describe('fcmp_tuples', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${JSON.stringify(a)} vs ${JSON.stringify(b)} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_tuples(a, b)), expected);
        });
    });
    it('should sort tuples lexicographically', function () {
        const input = [[2, 1], [1, 2], [1, 1]];
        const expected = [[1, 1], [1, 2], [2, 1]];
        assert.deepStrictEqual(input.sort(fcmp_tuples), expected);
    });
    it('should accept a custom fcmp for items', function () {
        const fcmp_desc = (a, b) => b - a;
        assert.strictEqual(Math.sign(fcmp_tuples([1], [2], fcmp_desc)), 1);
        assert.strictEqual(Math.sign(fcmp_tuples([1, 5], [1, 3], fcmp_desc)), -1);
        assert.strictEqual(fcmp_tuples([1, 2], [1, 2], fcmp_desc), 0);
    });
});
