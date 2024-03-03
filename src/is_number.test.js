const assert = require('assert');
const is_number = require('./is_number');

const items = [
    ['-inf → false', -Infinity, false],
    ['+inf → false', +Infinity, false],
    ['null → false', null, false],
    ['{} → false', {}, false],
    ['Symbol() → false', Symbol(), false],
    ['Function → false', () => 1, false],
    ['BigInt(1) → false', 1n, false],
];

describe('is_number', function () {
    items.forEach(function ([title, input, expected]) {
        it(title, function () {
            assert.deepStrictEqual(is_number(input), expected);
        });
    });
});
