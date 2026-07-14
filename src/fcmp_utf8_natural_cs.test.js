const assert = require('assert');
const fcmp_utf8_natural_cs = require('./fcmp_utf8_natural_cs');

const items = [
    // [a, b, expected sign]
    ['a', 'b', -1],
    ['b', 'a', 1],
    ['a', 'a', 0],
    ['file2', 'file10', -1], // numeric chunks compare as numbers
    ['file10', 'file2', 1],
    ['file2', 'file2', 0],
    ['2', '10', -1],
    ['a10', 'a9', 1],
    ['apple2', 'Banana1', -1], // locale-aware: case does not dominate base letters
];

describe('fcmp_utf8_natural_cs', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${JSON.stringify(a)} vs ${JSON.stringify(b)} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_utf8_natural_cs(a, b)), expected);
        });
    });
    it('should sort file names naturally', function () {
        const input = ['a10', 'a2', 'a1'];
        const expected = ['a1', 'a2', 'a10'];
        assert.deepStrictEqual(input.sort(fcmp_utf8_natural_cs), expected);
    });
    it('should distinguish case (exact order is locale-dependent)', function () {
        assert.notStrictEqual(Math.sign(fcmp_utf8_natural_cs('file2', 'FILE2')), 0);
        assert.strictEqual(Math.sign(fcmp_utf8_natural_cs('a', 'A')), -Math.sign(fcmp_utf8_natural_cs('A', 'a')));
    });
});
