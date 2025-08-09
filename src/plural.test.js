const assert = require('assert');
const plural = require('./plural');

const tests = [
    ['1 apple', 1, '# apple', '# apples', ],
    ['2 apples', 2, '# apple', '# apples'],
    ['10 apples', 10, '# apple', '# apples'],
    ['21 apple', 21, '# apple', '# apples'],
    ['0 apples', 0, '# apple', '# apples'],
    ['No apples', 0, '# apple', '# apples', 'No apples'],
];

describe('plural', function () {
    tests.forEach(function ([expected, ...args],) {
        it(expected, function () {
            const actual = plural(...args);
            assert.deepStrictEqual(actual, expected);
        });
    });
});
