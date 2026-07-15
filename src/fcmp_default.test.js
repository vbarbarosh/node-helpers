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
    ['9', '10', -1], // natural order: digit chunks compare by value
    ['2', '10', -1],
    ['file2', 'file10', -1],
    ['2', '02', -1], // equal value → fewer leading zeros first, see fcmp_default.md
    ['README.md', 'package.json', -1], // non-digit chunks keep code-unit order: uppercase first
    ['9'.repeat(30), '1' + '0'.repeat(30), -1], // digit runs beyond Number.MAX_SAFE_INTEGER
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
    it('should sort digit-bearing strings naturally', function () {
        assert.deepStrictEqual(['file10', 'file2', 'file1'].sort(fcmp_default), ['file1', 'file2', 'file10']);
    });
    it('should produce the canonical order', function () {
        assert.deepStrictEqual(['999', '22', '15', '10', '3', '2', '1'].sort(fcmp_default), ['1', '2', '3', '10', '15', '22', '999']);
        assert.deepStrictEqual([999, 22, 15, 10, 3, 2, 1].sort(fcmp_default), [1, 2, 3, 10, 15, 22, 999]);
        assert.deepStrictEqual(['ccc', 'bbb', 'aaa', 'CCC', 'BBB', 'AAA'].sort(fcmp_default), ['AAA', 'BBB', 'CCC', 'aaa', 'bbb', 'ccc']);
        assert.deepStrictEqual(['readme.md', 'README.md'].sort(fcmp_default), ['README.md', 'readme.md']);
        assert.deepStrictEqual(['a10', 'a2', 'A20', 'A3'].sort(fcmp_default), ['A3', 'A20', 'a2', 'a10']);
    });
    it('should return 0 for incomparable values', function () {
        assert.strictEqual(fcmp_default(NaN, 1), 0);
        assert.strictEqual(fcmp_default(undefined, 1), 0);
    });
});
