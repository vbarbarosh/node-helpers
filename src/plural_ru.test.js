const assert = require('assert');
const plural_ru = require('./plural_ru');

const forms = ['# яблоко', '# яблока', '# яблок'];

const tests = [
    ['0 яблок', 0, ...forms],
    ['Нет яблок', 0, ...forms, 'Нет яблок'],
    ['1 яблоко', 1, ...forms],
    ['2 яблока', 2, ...forms],
    ['3 яблока', 3, ...forms],
    ['4 яблока', 4, ...forms],
    ['5 яблок', 5, ...forms],
    ['10 яблок', 10, ...forms],
    ['11 яблок', 11, ...forms],
    ['12 яблок', 12, ...forms],
    ['14 яблок', 14, ...forms],
    ['15 яблок', 15, ...forms],
    ['20 яблок', 20, ...forms],
    ['21 яблоко', 21, ...forms],
    ['22 яблока', 22, ...forms],
    ['25 яблок', 25, ...forms],
    ['100 яблок', 100, ...forms],
    ['101 яблоко', 101, ...forms],
    ['102 яблока', 102, ...forms],
    ['105 яблок', 105, ...forms],
    ['111 яблок', 111, ...forms],
    ['112 яблок', 112, ...forms],
    ['121 яблоко', 121, ...forms],
    ['1.5 яблока', 1.5, ...forms],
    ['2.5 яблока', 2.5, ...forms],
    ['5.5 яблока', 5.5, ...forms],
    ['-1 яблоко', -1, ...forms],
    ['-2 яблока', -2, ...forms],
    ['-5 яблок', -5, ...forms],
    // A form without # comes back as it is: the helper picks a switch case
    ['0', 0, '1', '2', '5', '0'],
    ['5', 0, '1', '2', '5'],
    ['1', 1, '1', '2', '5', '0'],
    ['2', 2, '1', '2', '5', '0'],
    ['5', 5, '1', '2', '5', '0'],
    ['1', 21, '1', '2', '5', '0'],
];

describe('plural_ru', function () {
    for (const [expected, ...args] of tests) {
        it(expected, function () {
            const actual = plural_ru(...args);
            assert.deepStrictEqual(actual, expected);
        });
    }
});
