const assert = require('assert');
const format_seconds = require('./format_seconds');

const items = [
    ['-00:00:01', -1],
    ['-00:00:10', -10],
    ['-00:01:40', -100],
    ['-00:16:40', -1000],
    ['-02:46:40', -10000],
    ['-27:46:40', -100000],
    ['-277:46:40', -1000000],
    ['00:00:00', 0],
    ['00:00:01', 1],
    ['00:00:10', 10],
    ['00:01:40', 100],
    ['00:16:40', 1000],
    ['02:46:40', 10000],
    ['27:46:40', 100000],
    ['277:46:40', 1000000],
];

describe('format_seconds', function () {
    items.forEach(function ([expected, ...args]) {
        it(`${args} → ${expected}`, function () {
            assert.strictEqual(expected, format_seconds(...args));
        });
    });
});
