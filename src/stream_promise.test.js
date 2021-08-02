import fs from 'fs';
import ignore from './ignore';
import stream_promise from './stream_promise';

describe('stream_promise', function () {
    it('should handle ReadableStream', async function () {
        this.timeout(100);
        await stream_promise(fs.createReadStream(__filename).on('data', ignore));
    });
    it('should handle WritableStream', async function () {
        this.timeout(100);
        await stream_promise(fs.createWriteStream('/dev/null').end('hello\n'));
    });
});
