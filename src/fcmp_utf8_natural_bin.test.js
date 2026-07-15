const assert = require('assert');
const fcmp_utf8_natural_bin = require('./fcmp_utf8_natural_bin');

const items = [
    // [a, b, expected sign]
    ['a', 'b', -1],
    ['b', 'a', 1],
    ['a', 'a', 0],
    ['a', 'ab', -1],
    ['', 'a', -1],
    ['', '', 0],
    ['9', '10', -1],
    ['2', '10', -1],
    ['file2', 'file10', -1],
    ['file10a', 'file10b', -1],
    ['2', '02', -1], // equal value → fewer leading zeros first
    ['0', '00', -1],
    ['README.md', 'package.json', -1], // non-digit chunks keep code-unit order: uppercase first
    ['9'.repeat(30), '1' + '0'.repeat(30), -1], // digit runs beyond Number.MAX_SAFE_INTEGER
    ['a1', '1a', 1], // digit chunk vs text chunk compares as text: '1' < 'a'
    ['file', 'file1', -1],
    ['', '0', -1],
];

describe('fcmp_utf8_natural_bin', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${JSON.stringify(a)} vs ${JSON.stringify(b)} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_utf8_natural_bin(a, b)), expected);
            assert.strictEqual(Math.sign(fcmp_utf8_natural_bin(b, a)), -expected || 0);
        });
    });
    it('should sort digit-bearing strings naturally', function () {
        assert.deepStrictEqual(['file10', 'file2', 'file1'].sort(fcmp_utf8_natural_bin), ['file1', 'file2', 'file10']);
    });
});
