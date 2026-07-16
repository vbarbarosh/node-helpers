const assert = require('assert');
const factorize_ms = require('./factorize_ms');
const msval = require('./msval');

const items = [
    // [input, expected [h, m, s, ms]]
    [0, [0, 0, 0, 0]],
    [1, [0, 0, 0, 1]],
    [999, [0, 0, 0, 999]],
    [msval(0, 0, 5, 445), [0, 0, 5, 445]],
    [msval(1, 1, 1, 1), [1, 1, 1, 1]],
    [msval(999, 59, 59, 999), [999, 59, 59, 999]],

    // Sub-millisecond fractions are truncated
    [1500.7, [0, 0, 1, 500]],
    [999.999, [0, 0, 0, 999]],

    // Negative values are factorized by magnitude; the sign is the caller's concern
    [-msval(0, 1, 1, 0), [0, 1, 1, 0]],
    [-1500.7, [0, 0, 1, 500]],
];

describe('factorize_ms', function () {
    items.forEach(function ([input, expected]) {
        it(`${input} → ${JSON.stringify(expected)}`, function () {
            assert.deepStrictEqual(factorize_ms(input), expected);
        });
    });
});
