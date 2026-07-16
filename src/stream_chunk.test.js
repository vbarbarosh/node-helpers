const assert = require('assert');
const stream = require('stream');
const stream_chunk = require('./stream_chunk');

const items = [
    // [input, chunk_size, expected]
    [[1, 2, 3, 4, 5], 2, [[1, 2], [3, 4], [5]]],
    [[1, 2, 3, 4], 2, [[1, 2], [3, 4]]],
    [[1, 2, 3], 5, [[1, 2, 3]]],
    [[1, 2, 3], 1, [[1], [2], [3]]],
    [[], 2, []],
];

describe('stream_chunk', function () {
    items.forEach(function ([input, chunk_size, expected]) {
        it(`${JSON.stringify(input)} by ${chunk_size} → ${JSON.stringify(expected)}`, async function () {
            const out = await stream.Readable.from(input).pipe(stream_chunk(chunk_size)).toArray();
            assert.deepStrictEqual(out, expected);
        });
    });
});
