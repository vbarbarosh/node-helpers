const assert = require('assert');
const fs = require('fs');
const fs_fi = require('./fs_fi');
const fs_path_resolve = require('./fs_path_resolve');
const fs_tempdir = require('./fs_tempdir');
const fs_write = require('./fs_write');

describe('fs_fi', function () {
    it('should describe a regular file', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.txt');
            await fs_write(file, 'hello');
            const fi = await fs_fi(file);
            assert.strictEqual(fi.pathname, file);
            assert.strictEqual(fi.basename, 'data.txt');
            assert.deepStrictEqual(fi.flags, ['is_file']);
        });
    });
    it('should describe a symlink and its target', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.txt');
            const link = fs_path_resolve(d, 'link');
            await fs_write(file, 'hello');
            await fs.promises.symlink('data.txt', link);
            const fi = await fs_fi(link);
            assert.deepStrictEqual(fi.flags, ['is_symbolic_link']);
            assert.strictEqual(fi.target, 'data.txt');
            assert.strictEqual(fi.target_fi.pathname, file);
            assert.deepStrictEqual(fi.target_fi.flags, ['is_file']);
        });
    });
    it('should describe a broken symlink instead of throwing', async function () {
        await fs_tempdir(async function (d) {
            const link = fs_path_resolve(d, 'broken');
            await fs.promises.symlink('/nonexistent-target-xyz', link);
            const fi = await fs_fi(link);
            assert.deepStrictEqual(fi.flags, ['is_symbolic_link']);
            assert.strictEqual(fi.target, '/nonexistent-target-xyz');
            assert.strictEqual(fi.target_fi, null);
        });
    });
});
