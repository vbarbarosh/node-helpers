const assert = require('assert');
const stream = require('stream');
const stream_parse_csv = require('./stream_parse_csv');

describe('stream_parse_csv', function () {
    it('should parse csv rows', async function () {
        const out = await stream.Readable.from(['a,b\n1,2\n']).pipe(stream_parse_csv()).toArray();
        assert.deepStrictEqual(out, [['a', 'b'], ['1', '2']]);
    });
    it('should support a custom delimiter', async function () {
        const out = await stream.Readable.from(['a;b\n1;2\n']).pipe(stream_parse_csv({delimiter: ';'})).toArray();
        assert.deepStrictEqual(out, [['a', 'b'], ['1', '2']]);
    });
    it('should parse quoted fields with embedded delimiters and newlines', async function () {
        const out = await stream.Readable.from(['"a,x","b\ny"\n']).pipe(stream_parse_csv()).toArray();
        assert.deepStrictEqual(out, [['a,x', 'b\ny']]);
    });
    it('should parse input split across chunks', async function () {
        const out = await stream.Readable.from(['a,', 'b\n1', ',2\n']).pipe(stream_parse_csv()).toArray();
        assert.deepStrictEqual(out, [['a', 'b'], ['1', '2']]);
    });
    it('should reject on inconsistent column count', async function () {
        const p = stream.promises.pipeline(stream.Readable.from(['a,b\n1,2,3\n']), stream_parse_csv(), new stream.PassThrough({objectMode: true}));
        await assert.rejects(p, /Invalid Record Length/);
    });
    it('should accept inconsistent column count with relax_column_count', async function () {
        const out = await stream.Readable.from(['a,b\n1,2,3\n']).pipe(stream_parse_csv({relax_column_count: true})).toArray();
        assert.deepStrictEqual(out, [['a', 'b'], ['1', '2', '3']]);
    });
});
