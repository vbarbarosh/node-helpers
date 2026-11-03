const assert = require('assert');
const plural = require('./plural');

const tests = [
    ['0 steps', 0, '# step', '# steps'],
    ['no steps', 0, '# step', '# steps', 'no steps'],
    ['1 step', 1, '# step', '# steps'],
    ['2 steps', 2, '# step', '# steps'],
    ['11 steps', 11, '# step', '# steps'],
    ['21 steps', 21, '# step', '# steps'],
    ['101 steps', 101, '# step', '# steps'],
];

describe('plural', function () {
    for (const [expected, ...args] of tests) {
        it(expected, function () {
            const actual = plural(...args);
            assert.deepStrictEqual(actual, expected);
        });
    }
});
