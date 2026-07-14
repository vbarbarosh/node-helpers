const assert = require('assert');
const stream = require('stream');
const stream_each = require('./stream_each');
const stream_map = require('./stream_map');

async function collect(items, fn)
{
    const out = [];
    await stream.promises.pipeline(
        stream.Readable.from(items, {objectMode: true}),
        stream_map(fn),
        stream_each(item => out.push(item)),
    );
    return out;
}

describe('stream_map', function () {
    it('should transform items', async function () {
        assert.deepStrictEqual(await collect([1, 2, 3], v => v*10), [10, 20, 30]);
    });
    it('should support an async function', async function () {
        assert.deepStrictEqual(await collect([1, 2, 3], async v => v*10), [10, 20, 30]);
    });
    it('should drop items mapped to null or undefined', async function () {
        assert.deepStrictEqual(await collect(['a', 'skip', 'b', 'c'], v => v === 'skip' ? null : v), ['a', 'b', 'c']);
        assert.deepStrictEqual(await collect(['a', 'skip', 'b'], v => v === 'skip' ? undefined : v), ['a', 'b']);
    });
    it('should reject when fn throws', async function () {
        await assert.rejects(collect([1, 2, 3], () => { throw new Error('boom'); }), /boom/);
    });
});
