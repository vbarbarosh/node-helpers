const assert = require('assert');
const clamp = require('./clamp');

// clamp(min, max, value)
const items = [
    // Inside range
    [0, 10, 5, 5],
    [-10, 10, 0, 0],
    [0.5, 1.5, 1.25, 1.25],

    // Below range
    [0, 10, -1, 0],
    [-10, -5, -100, -10],

    // Above range
    [0, 10, 11, 10],
    [-10, -5, 0, -5],

    // Boundary equality
    [0, 10, 0, 0],
    [0, 10, 10, 10],
    [5, 5, 5, 5],

    // Degenerate range (min === max)
    [5, 5, 3, 5],
    [5, 5, 7, 5],
];

describe('clamp', function () {
    items.forEach(function ([min, max, value, expected]) {
        it(`clamp(${min}, ${max}, ${value}) → ${expected}`, function () {
            assert.strictEqual(clamp(min, max, value), expected);
        });
    });
});
