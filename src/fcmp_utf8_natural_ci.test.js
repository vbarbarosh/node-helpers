const assert = require('assert');
const fcmp_utf8_natural_ci = require('./fcmp_utf8_natural_ci');

const items = [
    // [a, b, expected sign]
    ['a', 'b', -1],
    ['b', 'a', 1],
    ['a', 'a', 0],
    ['file2', 'file10', -1], // numeric chunks compare as numbers
    ['file10', 'file2', 1],
    ['file2', 'file2', 0],
    ['file2', 'FILE2', 0],
    ['file2', 'FILE10', -1],
    ['2', '10', -1],
    ['item20', 'item100', -1],
    ['é', 'e', 0], // sensitivity=base also ignores accents
];

describe('fcmp_utf8_natural_ci', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${JSON.stringify(a)} vs ${JSON.stringify(b)} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_utf8_natural_ci(a, b)), expected);
        });
    });
    it('should sort file names naturally, ignoring case', function () {
        const input = ['file10', 'FILE2', 'file1'];
        const expected = ['file1', 'FILE2', 'file10'];
        assert.deepStrictEqual(input.sort(fcmp_utf8_natural_ci), expected);
    });
});
