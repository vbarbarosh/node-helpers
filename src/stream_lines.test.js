const assert = require('assert');
const stream = require('stream');
const stream_lines = require('./stream_lines');

describe('stream_lines', function () {
    it('should split a stream into lines', async function () {
        const out = await stream.Readable.from(['aaa\r\nbb', 'b\nccc']).pipe(stream_lines()).toArray();
        assert.deepStrictEqual(out.map(String), ['aaa', 'bbb', 'ccc']);
    });
    it('should handle an empty stream', async function () {
        const out = await stream.Readable.from([]).pipe(stream_lines()).toArray();
        assert.deepStrictEqual(out, []);
    });
});
