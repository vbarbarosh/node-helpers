const assert = require('assert');
const fs_file_md5 = require('./fs_file_md5');
const fs_path_resolve = require('./fs_path_resolve');

describe('fs_file_md5', function () {
    it('should calculate md5 fs_file_md5.js', async function () {
        const actual = await fs_file_md5(fs_path_resolve(__dirname, 'fs_file_md5.js'));
        const expected = '103bffdc1df3af79bfd3f4b8b1bd2ed7';
        assert.strictEqual(actual, expected);
    });
});
