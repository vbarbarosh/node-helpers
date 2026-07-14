const assert = require('assert');
const fs_fi = require('./fs_fi');
const fs_mkdirp = require('./fs_mkdirp');
const fs_path_resolve = require('./fs_path_resolve');
const fs_tempdir = require('./fs_tempdir');
const fs_write = require('./fs_write');

describe('fs_mkdirp', function () {
    it('should accept empty array', async function () {
        await fs_tempdir(async function (d) {
            const tmp = fs_path_resolve(d, 'a/b/c/d/e');
            await fs_mkdirp(tmp);
            assert(await fs_fi(tmp).then(v => v.isDirectory()));
        });
    });
    it('should resolve when the directory already exists', async function () {
        await fs_tempdir(async function (d) {
            const tmp = fs_path_resolve(d, 'a/b');
            await fs_mkdirp(tmp);
            assert.strictEqual(await fs_mkdirp(tmp), tmp);
        });
    });
    it('should throw EEXIST when the path exists as a regular file', async function () {
        await fs_tempdir(async function (d) {
            const tmp = fs_path_resolve(d, 'plain');
            await fs_write(tmp, 'hello');
            await assert.rejects(fs_mkdirp(tmp), {code: 'EEXIST'});
        });
    });
    it('should create the same directory structure in parallel', async function () {
        await fs_tempdir(async function (d) {
            const tmp = fs_path_resolve(d, 'a/b/c/d/e/f/g/h');
            await Promise.all(Array(10).fill(tmp).map(async function () {
                await fs_mkdirp(tmp);
                assert(await fs_fi(tmp).then(v => v.isDirectory()));
            }));
        });
    });
});
