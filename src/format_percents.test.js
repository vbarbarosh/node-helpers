const assert = require('assert');
const format_percents = require('./format_percents');

const items = [
    ['', '0%'],
    [0, '0%'],
    [0.01, '1.00%'],
    [0.0101, '1.01%'],
    [0.1, '10.00%'],
    [0.5, '50.00%'],
    [0.99, '99.00%'],
    [0.9901, '99.01%'],
    [1, '100%'],
];

describe('format_percents', function () {
    items.forEach(function ([input, expected]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(format_percents(input), expected);
        });
    });
});
