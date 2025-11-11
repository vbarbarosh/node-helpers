import assert from 'assert';
import range from './range';

const cases = [
    // 1-argument: (stop)
    {args: [10], expected: [0,1,2,3,4,5,6,7,8,9]},
    {args: [-10], expected: []}, // 💎 Consider non-standard semantics: range(-5) -> [0,-1,-2,-3,-4]

    // 2-arguments: (start, stop)
    {args: [3, 7], expected: [3,4,5,6]},
    {args: [0, 0], expected: []},
    {args: [5, 3], expected: []}, // positive direction, start > stop → empty

    // 3-arguments: (start, stop, step)
    {args: [3, 10, 2], expected: [3,5,7,9]},
    {args: [3, 10, 3], expected: [3,6,9]},

    // Negative step
    {args: [10, 3, -2], expected: [10,8,6,4]},
    {args: [10, 3, -3], expected: [10,7,4]},

    // Negative step but no progression
    {args: [3, 10, -1], expected: []}, // step direction does not match range

    // Step = 1 edge
    {args: [5, 5, 1], expected: []},
    {args: [5, 6, 1], expected: [5]},

    // Step = -1 edge
    {args: [5, 5, -1], expected: []},
    {args: [6, 5, -1], expected: [6]},
];

describe('range', function () {
    cases.forEach(function (item, i) {
        it(`range #${i+1}: ${JSON.stringify(item)}`, function () {
            const actual = range(...item.args);
            assert.deepStrictEqual(actual, item.expected);
        })
    });
});
