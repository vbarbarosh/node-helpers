const assert = require('assert');
const fs = require('fs');
const fs_find = require('./fs_find');
const fs_mkdirp = require('./fs_mkdirp');
const fs_path_resolve = require('./fs_path_resolve');
const fs_tempdir = require('./fs_tempdir');
const fs_write = require('./fs_write');

describe('fs_find', function () {
    it('should list a directory tree', async function () {
        await fs_tempdir(async function (d) {
            await fs_mkdirp(fs_path_resolve(d, 'sub'));
            await fs_write(fs_path_resolve(d, 'a.txt'), 'a');
            await fs_write(fs_path_resolve(d, 'sub/b.txt'), 'b');
            const rows = await fs_find(d);
            assert.strictEqual(rows[0].pathname, fs_path_resolve(d));
            assert.deepStrictEqual(rows.slice(1).map(v => v.basename).sort(), ['a.txt', 'b.txt', 'sub']);
        });
    });
    it('should not fail on a broken symlink', async function () {
        await fs_tempdir(async function (d) {
            await fs_write(fs_path_resolve(d, 'a.txt'), 'a');
            await fs.promises.symlink('/nonexistent-target-xyz', fs_path_resolve(d, 'broken'));
            const rows = await fs_find(d);
            assert.deepStrictEqual(rows.slice(1).map(v => v.basename).sort(), ['a.txt', 'broken']);
        });
    });
});
