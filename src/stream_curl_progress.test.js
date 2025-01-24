const assert = require('assert');
const fs = require('fs');
const fs_path_resolve = require('./fs_path_resolve');
const fs_read_json = require('./fs_read_json');
const stream = require('stream');
const stream_curl_progress = require('./stream_curl_progress');

describe('stream_curl_progress', function () {
    it('should handle basic input', async function () {
        const expected = await fs_read_json(fs_path_resolve(__dirname, 'stream_curl_progress.d/basic.json'));
        const actual = await stream.compose(
            fs.createReadStream(fs_path_resolve(__dirname, 'stream_curl_progress.d/basic')),
            stream_curl_progress(),
        ).toArray();
        assert.deepStrictEqual(actual, expected);
    });
});
