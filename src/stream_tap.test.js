const assert = require('assert');
const stream = require('stream');
const stream_tap = require('./stream_tap');

describe('stream_tap', function () {
    it('should call fn on each item and pass items down unchanged', async function () {
        const seen = [];
        const out = await stream.Readable.from([1, 2, 3]).pipe(stream_tap(v => seen.push(v * 10))).toArray();
        assert.deepStrictEqual(out, [1, 2, 3]);
        assert.deepStrictEqual(seen, [10, 20, 30]);
    });
    it('should reject when fn throws', async function () {
        const p = stream.promises.pipeline(stream.Readable.from([1]), stream_tap(function () {
            throw new Error('boom');
        }), new stream.PassThrough({objectMode: true}));
        await assert.rejects(p, /boom/);
    });
});
