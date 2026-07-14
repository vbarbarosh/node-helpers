const assert = require('assert');
const fcmp_utf8_ci = require('./fcmp_utf8_ci');

const items = [
    // [a, b, expected sign]
    ['a', 'b', -1],
    ['b', 'a', 1],
    ['a', 'a', 0],
    ['a', 'A', 0],
    ['HELLO', 'hello', 0],
    ['apple', 'Banana', -1], // locale-aware: case does not dominate base letters
    ['Banana', 'apple', 1],
    ['é', 'e', 0], // sensitivity=base also ignores accents
    ['ü', 'U', 0],
    ['file10', 'file2', -1], // no numeric awareness: '1' < '2'
];

describe('fcmp_utf8_ci', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${JSON.stringify(a)} vs ${JSON.stringify(b)} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_utf8_ci(a, b)), expected);
        });
    });
    it('should sort case-insensitively, keeping the initial order of case variants ([].sort is stable)', function () {
        assert.deepStrictEqual(['b', 'A', 'B', 'a'].sort(fcmp_utf8_ci), ['A', 'a', 'b', 'B']);
    });
});
