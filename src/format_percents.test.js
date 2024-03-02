const assert = require('assert');
const format_percents = require('./format_percents');

const items = [
    ['', '0%'],
    [0, '0%'],
    [0.5, '50%'],
    [1, '100%'],
];

describe('format_percents', function () {
    items.forEach(function ([input, expected]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(expected, format_percents(input));
        });
    });
});
