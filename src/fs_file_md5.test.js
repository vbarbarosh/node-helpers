const assert = require('assert');
const fs_file_md5 = require('./fs_file_md5');
const fs_path_resolve = require('./fs_path_resolve');
const fs_tempdir = require('./fs_tempdir');
const fs_write = require('./fs_write');

describe('fs_file_md5', function () {
    it('should calculate md5 of a file', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.txt');
            await fs_write(file, 'hello world');
            assert.strictEqual(await fs_file_md5(file), '5eb63bbbe01eeed093cb22bb8f5acdc3');
        });
    });
    it('should calculate md5 of an empty file', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'empty.txt');
            await fs_write(file, '');
            assert.strictEqual(await fs_file_md5(file), 'd41d8cd98f00b204e9800998ecf8427e');
        });
    });
    it('should support the encoding argument', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.txt');
            await fs_write(file, 'hello world');
            assert.strictEqual(await fs_file_md5(file, 'base64'), 'XrY7u+Ae7tCTyyK7j1rNww==');
        });
    });
});
