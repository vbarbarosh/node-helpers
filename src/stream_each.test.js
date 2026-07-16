const assert = require('assert');
const stream = require('stream');
const stream_each = require('./stream_each');

describe('stream_each', function () {
    it('should call fn on each item in order', async function () {
        const seen = [];
        await stream.promises.pipeline(stream.Readable.from([1, 2, 3]), stream_each(v => seen.push(v)));
        assert.deepStrictEqual(seen, [1, 2, 3]);
    });
    it('should await an async fn', async function () {
        const seen = [];
        await stream.promises.pipeline(stream.Readable.from([1, 2, 3]), stream_each(async function (v) {
            await new Promise(resolve => setImmediate(resolve));
            seen.push(v);
        }));
        assert.deepStrictEqual(seen, [1, 2, 3]);
    });
    it('should reject when fn throws', async function () {
        const p = stream.promises.pipeline(stream.Readable.from([1, 2, 3]), stream_each(function () {
            throw new Error('boom');
        }));
        await assert.rejects(p, /boom/);
    });
});
