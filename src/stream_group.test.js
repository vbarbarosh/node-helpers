const assert = require('assert');
const stream = require('stream');
const stream_group = require('./stream_group');

describe('stream_group', function () {
    it('should behave as stream_chunk (deprecated alias)', async function () {
        const out = await stream.Readable.from([1, 2, 3]).pipe(stream_group(2)).toArray();
        assert.deepStrictEqual(out, [[1, 2], [3]]);
    });
});
