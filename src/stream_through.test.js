const assert = require('assert');
const stream = require('stream');
const stream_through = require('./stream_through');

describe('stream_through', function () {
    it('should behave as stream_tap (deprecated alias)', async function () {
        const seen = [];
        const out = await stream.Readable.from([1, 2]).pipe(stream_through(v => seen.push(v))).toArray();
        assert.deepStrictEqual(out, [1, 2]);
        assert.deepStrictEqual(seen, [1, 2]);
    });
});
