const assert = require('assert');
const stream = require('stream');
const stream_transform = require('./stream_transform');

describe('stream_transform', function () {
    it('should behave as stream_map (deprecated alias)', async function () {
        const out = await stream.Readable.from([1, 2, 3]).pipe(stream_transform(v => v * 10)).toArray();
        assert.deepStrictEqual(out, [10, 20, 30]);
    });
});
