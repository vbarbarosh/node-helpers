const assert = require('assert');
const stream = require('stream');
const stream_lines = require('./stream_lines');

describe('stream_lines', function () {
    it('should split a stream into lines', async function () {
        const out = await stream.Readable.from(['aaa\r\nbb', 'b\nccc']).pipe(stream_lines()).toArray();
        assert.deepStrictEqual(out.map(String), ['aaa', 'bbb', 'ccc']);
    });
    it('should not corrupt multi-byte utf8 split across chunks', async function () {
        const buf = Buffer.from('café au lait\nwörld\n');
        const chunks = [];
        for (let i = 0; i < buf.length; ++i) {
            chunks.push(buf.subarray(i, i + 1)); // 1-byte chunks: the worst case
        }
        const out = await stream.Readable.from(chunks).pipe(stream_lines()).toArray();
        assert.deepStrictEqual(out, ['café au lait', 'wörld']);
    });
    it('should handle an empty stream', async function () {
        const out = await stream.Readable.from([]).pipe(stream_lines()).toArray();
        assert.deepStrictEqual(out, []);
    });
});
