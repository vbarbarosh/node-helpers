const assert = require('assert');
const stream = require('stream');
const stream_skip = require('./stream_skip');

const items = [
    // [input, n, expected]
    [[1, 2, 3, 4, 5], 2, [3, 4, 5]],
    [[1, 2, 3], 0, [1, 2, 3]],
    [[1, 2, 3], 5, []],
    [[], 2, []],
];

describe('stream_skip', function () {
    items.forEach(function ([input, n, expected]) {
        it(`${JSON.stringify(input)} skip ${n} → ${JSON.stringify(expected)}`, async function () {
            const out = await stream.Readable.from(input).pipe(stream_skip(n)).toArray();
            assert.deepStrictEqual(out, expected);
        });
    });
});
