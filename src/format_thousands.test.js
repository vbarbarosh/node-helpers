const assert = require('assert');
const format_thousands = require('./format_thousands');

const items = [
    ['-1', -1],
    ['-100', -100],
    ['-1,000', -1000],
    ['-10,000', -10000],
    ['-100,000', -100000],
    ['-1,000,000', -1000000],
    ['1', 1],
    ['100', 100],
    ['1,000', 1000],
    ['10,000', 10000],
    ['100,000', 100000],
    ['1,000,000', 1000000],
    ['1.55', 1.55],
    ['1.1234512345', 1.1234512345],
    ['123,456,789.01234', 123456789.01234],
];

describe('format_thousands', function () {
    items.forEach(function ([expected, ...args]) {
        it(`${args} → ${expected}`, function () {
            assert.strictEqual(expected, format_thousands(...args));
        });
    });
});
