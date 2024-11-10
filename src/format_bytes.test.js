const assert = require('assert');
const format_bytes = require('./format_bytes');

const items = [
    ['', 'n/a'],
    [null, 'n/a'],
    [undefined, 'n/a'],
    [0, '0KB'],
    [1, '1KB'],
    [1023, '1KB'],
    [2048, '2KB'],
    [35.45*1024*1024, '35.45MB'],
    [3.92*1024*1024*1024, '3.92GB'],
];

describe('format_bytes', function () {
    items.forEach(function ([input, expected]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(format_bytes(input), expected);
        });
    });
});
