const assert = require('assert');
const format_ms = require('./format_ms');

const items = [
    ['00:00', ''],
    ['00:00', null],
    ['00:00', undefined],
    ['00:00', x(0, 0, 0, 0)],
    ['00:00', x(0, 0, 0, 1)],
    ['00:00', x(0, 0, 0, 900)],
    ['00:01', x(0, 0, 1, 0)],
    ['00:01', x(0, 0, 1, 500)],
    ['00:02', x(0, 0, 2, 0)],
    ['00:05', x(0, 0, 5, 445)],
    ['01:00', x(0, 1, 0, 0)],
    ['12:00', x(0, 12, 0, 0)],
    ['12:12', x(0, 12, 12, 12)],
    ['01:00:00', x(1, 0, 0, 0)],
    ['01:01:00', x(1, 1, 0, 0)],
    ['01:01:01', x(1, 1, 1, 0)],
    ['01:01:01', x(1, 1, 1, 1)],
    ['12:12:12', x(12, 12, 12, 12)],
    ['999:00:00', x(999, 0, 0, 0)],
];

describe('format_ms', function () {
    items.forEach(function ([expected, input]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(format_ms(input), expected);
        });
    });
});

function x(h, m, s, ms)
{
    return h*3600000 + m*60000 + s*1000 + ms;
}
