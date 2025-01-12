const assert = require('assert');
const format_ms2 = require('./format_ms2');
const msval = require('./msval');

const items = [
    ['00:00.00', ''],
    ['00:00.00', null],
    ['00:00.00', undefined],
    ['00:00.00', msval(0, 0, 0, 0)],
    ['00:00.00', msval(0, 0, 0, 1)],
    ['00:00.90', msval(0, 0, 0, 900)],
    ['00:01.00', msval(0, 0, 1, 0)],
    ['00:01.50', msval(0, 0, 1, 500)],
    ['00:02.00', msval(0, 0, 2, 0)],
    ['00:05.45', msval(0, 0, 5, 445)],
    ['01:00.00', msval(0, 1, 0, 0)],
    ['12:00.00', msval(0, 12, 0, 0)],
    ['12:12.01', msval(0, 12, 12, 12)],
    ['01:00:00.00', msval(1, 0, 0, 0)],
    ['01:01:00.00', msval(1, 1, 0, 0)],
    ['01:01:01.00', msval(1, 1, 1, 0)],
    ['01:01:01.00', msval(1, 1, 1, 1)],
    ['12:12:12.01', msval(12, 12, 12, 12)],
    ['999:00:00.00', msval(999, 0, 0, 0)],
];

describe('format_ms2', function () {
    items.forEach(function ([expected, input]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(format_ms2(input), expected);
        });
    });
});
