const assert = require('assert');
const stream = require('stream');
const stream_strpbrk = require('./stream_strpbrk');

const items = [
    ['empty', '|', [], []],
    ['| -> empty', '|', ['|'], []],
    ['|| -> empty', '|', ['||'], []],
    ['||| -> empty', '|', ['|', '|', '|'], []],
    ['a → a', '|', ['a'], ['a']],
    ['|a → a', '|', ['|a'], ['a']],
    ['a| → a', '|', ['a|'], ['a']],
    ['a|b → a,b', '|', ['a|b'], ['a', 'b']],
    ['a|||b → a,b', '|', ['a|||b'], ['a', 'b']],
    ['abc → abc', '|', ['a', 'b', 'c'], ['abc']],
    ['a|b;c', '|;', ['a|b;c'], ['a', 'b', 'c']],
];

describe('stream_strpbrk', function () {
    items.forEach(function ([title, delimiters, input, expected]) {
        it(title, async function () {
            const actual = await stream.Readable.from(input).pipe(stream_strpbrk(delimiters)).toArray();
            assert.deepStrictEqual(actual, expected);
        });
    });
});
