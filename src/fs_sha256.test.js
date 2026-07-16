const assert = require('assert');
const fs_path_resolve = require('./fs_path_resolve');
const fs_sha256 = require('./fs_sha256');
const fs_tempdir = require('./fs_tempdir');
const fs_write = require('./fs_write');

describe('fs_sha256', function () {
    it('should calculate sha256 of a file', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.txt');
            await fs_write(file, 'hello');
            assert.strictEqual(await fs_sha256(file), '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
        });
    });
    it('should calculate sha256 of an empty file', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'empty.txt');
            await fs_write(file, '');
            assert.strictEqual(await fs_sha256(file), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
        });
    });
    it('should throw for a missing file', async function () {
        await fs_tempdir(async function (d) {
            await assert.rejects(fs_sha256(fs_path_resolve(d, 'missing.txt')), /ENOENT/);
        });
    });
});
