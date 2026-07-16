const stream = require('stream');
const stream_discard = require('./stream_discard');

describe('stream_discard', function () {
    it('should consume a byte stream', async function () {
        await stream.promises.pipeline(stream.Readable.from([Buffer.from('aaa'), Buffer.from('bbb')]), stream_discard());
    });
    it('should consume an object stream', async function () {
        await stream.promises.pipeline(stream.Readable.from([{a: 1}, {b: 2}]), stream_discard({objectMode: true}));
    });
    it('should consume an empty stream', async function () {
        await stream.promises.pipeline(stream.Readable.from([]), stream_discard());
    });
});
