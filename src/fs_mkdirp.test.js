const assert = require('assert');
const fs_fi = require('./fs_fi');
const fs_mkdirp = require('./fs_mkdirp');
const fs_path_resolve = require('./fs_path_resolve');
const fs_tempdir = require('./fs_tempdir');

describe('fs_mkdirp', function () {
    it('should accept empty array', async function () {
        await fs_tempdir(async function (d) {
            const tmp = fs_path_resolve(d, 'a/b/c/d/e');
            await fs_mkdirp(tmp);
            assert(await fs_fi(tmp).then(v => v.isDirectory()));
        });
    });
});
