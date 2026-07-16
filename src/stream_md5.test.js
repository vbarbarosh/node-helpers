const assert = require('assert');
const stream = require('stream');
const stream_md5 = require('./stream_md5');

describe('stream_md5', function () {
    it('should emit the md5 hex digest of all chunks', async function () {
        const out = Buffer.concat(await stream.Readable.from(['aaa', 'bbb']).pipe(stream_md5()).toArray()).toString('utf8');
        assert.strictEqual(out, '6547436690a26a399603a7096e876a2d');
    });
    it('should hash an empty stream', async function () {
        const out = Buffer.concat(await stream.Readable.from([]).pipe(stream_md5()).toArray()).toString('utf8');
        assert.strictEqual(out, 'd41d8cd98f00b204e9800998ecf8427e');
    });
});
