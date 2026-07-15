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
    ['1.35GiB', Math.floor(1.35*1024*1024*1024)],
    ['123', 123], // bare number means bytes
    ['5 MB', 5*1024*1024], // whitespace between number and unit
    [' 1KB ', 1024],
    ['12KB34', Number.NaN], // trailing garbage is not 12KB
    ['x5MB', Number.NaN],
];

describe('parse_bytes', function () {
    items.forEach(function ([input, expected]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(expected, parse_bytes(input));
        });
    });
});
