const assert = require('assert');
const stream = require('stream');
const stream_hash = require('./stream_hash');

describe('stream_hash', function () {
    it('should emit the sha256 hex digest of all chunks', async function () {
        const out = Buffer.concat(await stream.Readable.from(['aaa', 'bbb']).pipe(stream_hash('sha256')).toArray()).toString('utf8');
        assert.strictEqual(out, '2ce109e9d0faf820b2434e166297934e6177b65ab9951dbc3e204cad4689b39c');
    });
    it('should default to md5', async function () {
        const out = Buffer.concat(await stream.Readable.from(['aaa', 'bbb']).pipe(stream_hash()).toArray()).toString('utf8');
        assert.strictEqual(out, '6547436690a26a399603a7096e876a2d');
    });
    it('should hash an empty stream', async function () {
        const out = Buffer.concat(await stream.Readable.from([]).pipe(stream_hash()).toArray()).toString('utf8');
        assert.strictEqual(out, 'd41d8cd98f00b204e9800998ecf8427e');
    });
});
