const assert = require('assert');
const msval = require('./msval');

// msval(h, m, s, ms)
const items = [
    // Single components
    [[0, 0, 0, 0], 0],
    [[0, 0, 0, 1], 1],
    [[0, 0, 1, 0], 1000],
    [[0, 1, 0, 0], 60000],
    [[1, 0, 0, 0], 3600000],

    // Composition
    [[1, 1, 1, 1], 3661001],
    [[2, 30, 15, 500], 9015500],
    [[0, 90, 0, 0], 5400000],       // components are not normalized
    [[0, 0, 0, 1500], 1500],        // ms over 999 just adds up
    [[24, 0, 0, 0], 86400000],

    // Negative components subtract
    [[1, 0, 0, -1], 3599999],
    [[0, -1, 30, 0], -30000],
];

describe('msval', function () {
    items.forEach(function ([args, expected]) {
        it(`msval(${args.join(', ')}) → ${expected}`, function () {
            assert.strictEqual(msval(...args), expected);
        });
    });
});
