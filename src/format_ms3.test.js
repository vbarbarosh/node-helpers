const assert = require('assert');
const format_ms3 = require('./format_ms3');
const msval = require('./msval');

const items = [
    ['00:00.000', ''],
    ['00:00.000', null],
    ['00:00.000', undefined],
    ['00:00.000', msval(0, 0, 0, 0)],
    ['00:00.001', msval(0, 0, 0, 1)],
    ['00:00.900', msval(0, 0, 0, 900)],
    ['00:01.000', msval(0, 0, 1, 0)],
    ['00:01.500', msval(0, 0, 1, 500)],
    ['00:02.000', msval(0, 0, 2, 0)],
    ['00:05.445', msval(0, 0, 5, 445)],
    ['01:00.000', msval(0, 1, 0, 0)],
    ['12:00.000', msval(0, 12, 0, 0)],
    ['12:12.012', msval(0, 12, 12, 12)],
    ['01:00:00.000', msval(1, 0, 0, 0)],
    ['01:01:00.000', msval(1, 1, 0, 0)],
    ['01:01:01.000', msval(1, 1, 1, 0)],
    ['01:01:01.001', msval(1, 1, 1, 1)],
    ['12:12:12.012', msval(12, 12, 12, 12)],
    ['999:00:00.000', msval(999, 0, 0, 0)],
];

describe('format_ms3', function () {
    items.forEach(function ([expected, input]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(format_ms3(input), expected);
        });
    });
});
