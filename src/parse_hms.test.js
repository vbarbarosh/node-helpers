const assert = require('assert');
const parse_hms = require('./parse_hms');

const items = [
    ['', 0],
    [null, 0],
    [undefined, 0],
    ['0', 0],
    ['0:5', 5],
    ['00:05', 5],
    ['0:15', 15],
    ['0:15.123', 15.123],
    ['0:75.123', 75.123],
    ['   5', 5],
    [' 0:05 ', 5],
    [100, 100],
    ['1:2:3:4', NaN, 'Too many segments'],
    ['abc', NaN, 'Non-numeric'],
    ['0:ab', NaN, 'Non-numeric'],
    ['1:x:3', NaN, 'Non-numeric'],
];

describe('parse_hms', function () {
    items.forEach(function ([input, expected, description]) {
        const title = description
            ? `${input} → ${expected} | ${description}`
            : `${input} → ${expected}`;
        it(title, function () {
            assert.strictEqual(expected, parse_hms(input));
        });
    });
});
