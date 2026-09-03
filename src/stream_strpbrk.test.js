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
    ['a|b;c', '|;', ['a|b', ';c'], ['a', 'b', 'c']],
    ['Buffer(a) → a', '|', ['a'].map(Buffer.from), ['a']],
    ['Buffer(a|b) → a,b', '|', ['a|b'].map(Buffer.from), ['a', 'b']],
];

describe('stream_strpbrk', function () {
    items.forEach(function ([title, delimiters, input, expected]) {
        it(title, async function () {
            const actual = await stream.Readable.from(input).pipe(stream_strpbrk(delimiters)).toArray();
            assert.deepStrictEqual(actual, expected);
        });
    });
    it('should not corrupt multi-byte utf8 split across chunks', async function () {
        const buf = Buffer.from('héllo|wörld|');
        const chunks = [];
        for (let i = 0; i < buf.length; ++i) {
            chunks.push(buf.subarray(i, i + 1)); // 1-byte chunks: the worst case
        }
        const actual = await stream.Readable.from(chunks).pipe(stream_strpbrk('|')).toArray();
        assert.deepStrictEqual(actual, ['héllo', 'wörld']);
    });
});
