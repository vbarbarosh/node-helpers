const assert = require('assert');
const fcmp_utf8_bin = require('./fcmp_utf8_bin');

const items = [
    // [a, b, expected sign]
    ['a', 'b', -1],
    ['b', 'a', 1],
    ['a', 'a', 0],
    ['a', 'ab', -1],
    ['B', 'a', -1], // uppercase code points come before lowercase
    ['a', 'B', 1],
    ['A', 'a', -1], // case-sensitive
    ['e', 'é', -1], // U+0065 < U+00E9
    ['é', 'z', 1], // U+00E9 > U+007A
    ['ü', 'é', 1], // U+00FC > U+00E9
    ['file10', 'file2', -1], // no numeric awareness: '1' < '2'
];

describe('fcmp_utf8_bin', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${JSON.stringify(a)} vs ${JSON.stringify(b)} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_utf8_bin(a, b)), expected);
        });
    });
    it('should sort strings in code point order (all uppercase before lowercase)', function () {
        assert.deepStrictEqual(['b', 'A', 'a', 'B'].sort(fcmp_utf8_bin), ['A', 'B', 'a', 'b']);
    });
});
