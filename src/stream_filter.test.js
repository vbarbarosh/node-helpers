const assert = require('assert');
const stream = require('stream');
const stream_filter = require('./stream_filter');

describe('stream_filter', function () {
    it('should pass down only matching items', async function () {
        const out = await stream.Readable.from([1, 2, 3, 4, 5]).pipe(stream_filter(v => v % 2)).toArray();
        assert.deepStrictEqual(out, [1, 3, 5]);
    });
    it('should support an async predicate', async function () {
        const out = await stream.Readable.from([1, 2, 3]).pipe(stream_filter(async v => v > 1)).toArray();
        assert.deepStrictEqual(out, [2, 3]);
    });
    it('should reject when fn throws', async function () {
        const p = stream.promises.pipeline(stream.Readable.from([1]), stream_filter(function () {
            throw new Error('boom');
        }), new stream.PassThrough({objectMode: true}));
        await assert.rejects(p, /boom/);
    });
});
