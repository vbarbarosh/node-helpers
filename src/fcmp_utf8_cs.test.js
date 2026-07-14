const assert = require('assert');
const fcmp_utf8_cs = require('./fcmp_utf8_cs');

const items = [
    // [a, b, expected sign]
    ['a', 'b', -1],
    ['b', 'a', 1],
    ['a', 'a', 0],
    ['a', 'ab', -1],
    ['apple', 'Banana', -1], // locale-aware: case does not dominate base letters (unlike code point order)
    ['Banana', 'apple', 1],
];

describe('fcmp_utf8_cs', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${JSON.stringify(a)} vs ${JSON.stringify(b)} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_utf8_cs(a, b)), expected);
        });
    });
    it('should sort by base letters first, regardless of case', function () {
        assert.deepStrictEqual(['cherry', 'Apple', 'banana'].sort(fcmp_utf8_cs), ['Apple', 'banana', 'cherry']);
    });
    it('should distinguish case (exact order is locale-dependent)', function () {
        assert.notStrictEqual(Math.sign(fcmp_utf8_cs('a', 'A')), 0);
        assert.notStrictEqual(Math.sign(fcmp_utf8_cs('HELLO', 'hello')), 0);
        assert.strictEqual(Math.sign(fcmp_utf8_cs('a', 'A')), -Math.sign(fcmp_utf8_cs('A', 'a')));
    });
    it('should distinguish accents (exact order is locale-dependent)', function () {
        assert.notStrictEqual(Math.sign(fcmp_utf8_cs('e', 'é')), 0);
        assert.notStrictEqual(Math.sign(fcmp_utf8_cs('u', 'ü')), 0);
        assert.strictEqual(Math.sign(fcmp_utf8_cs('e', 'é')), -Math.sign(fcmp_utf8_cs('é', 'e')));
    });
});
