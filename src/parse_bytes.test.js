const assert = require('assert');
const parse_bytes = require('./parse_bytes');

const items = [
    ['', Number.NaN],
    [null, Number.NaN],
    [undefined, Number.NaN],
    ['0KB', 0],
    ['1KB', 1024],
    ['2KB', 2048],
    ['35.45MB', Math.floor(35.45*1024*1024)],
    ['3.92GB', Math.floor(3.92*1024*1024*1024)],
];

describe('parse_bytes', function () {
    items.forEach(function ([input, expected]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(expected, parse_bytes(input));
        });
    });
});
