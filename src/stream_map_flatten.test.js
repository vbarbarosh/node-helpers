const assert = require('assert');
const stream = require('stream');
const stream_map_flatten = require('./stream_map_flatten');

describe('stream_map_flatten', function () {
    it('should pass down each item yielded by a generator', async function () {
        const out = await stream.Readable.from([1, 2]).pipe(stream_map_flatten(function* (v) {
            yield v;
            yield v * 10;
        })).toArray();
        assert.deepStrictEqual(out, [1, 10, 2, 20]);
    });
    it('should support an async generator', async function () {
        const out = await stream.Readable.from([1, 2]).pipe(stream_map_flatten(async function* (v) {
            yield v;
            yield v * 10;
        })).toArray();
        assert.deepStrictEqual(out, [1, 10, 2, 20]);
    });
    it('should support fn returning an array', async function () {
        const out = await stream.Readable.from(['a b', 'c']).pipe(stream_map_flatten(v => v.split(' '))).toArray();
        assert.deepStrictEqual(out, ['a', 'b', 'c']);
    });
    it('should reject when fn throws', async function () {
        const p = stream.promises.pipeline(stream.Readable.from([1]), stream_map_flatten(function () {
            throw new Error('boom');
        }), new stream.PassThrough({objectMode: true}));
        await assert.rejects(p, /boom/);
    });
});
