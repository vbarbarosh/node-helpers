const assert = require('assert');
const format_kilo = require('./format_kilo');

const items = [
    ['', 'n/a'],
    [null, 'n/a'],
    [undefined, 'n/a'],
    [0, '0'],
    [1, '1'],
    [900, '900'],
    [1500, '1.5K'],
    [2000, '2K'],
    [35.45*1000*1000, '35.45M'],
    [3.92*1000*1000*1000, '3.92G'],
];

describe('format_kilo', function () {
    items.forEach(function ([input, expected]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(format_kilo(input), expected);
        });
    });
});