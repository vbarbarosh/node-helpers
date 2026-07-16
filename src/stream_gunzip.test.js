const assert = require('assert');
const stream = require('stream');
const stream_gunzip = require('./stream_gunzip');
const zlib = require('zlib');

describe('stream_gunzip', function () {
    it('should decompress gzipped data', async function () {
        const gz = zlib.gzipSync('hello world');
        const out = Buffer.concat(await stream.Readable.from([gz]).pipe(stream_gunzip()).toArray());
        assert.strictEqual(out.toString('utf8'), 'hello world');
    });
    it('should reject on corrupt input', async function () {
        const p = stream.promises.pipeline(stream.Readable.from([Buffer.from('not gzip')]), stream_gunzip(), new stream.PassThrough());
        await assert.rejects(p, /incorrect header check/);
    });
});
