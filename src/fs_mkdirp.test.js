import assert from 'assert';
import fs_fi from './fs_fi';
import fs_mkdirp from './fs_mkdirp';
import fs_path_resolve from './fs_path_resolve';
import fs_tempdir from './fs_tempdir';

describe('fs_mkdirp', function () {
    it('should accept empty array', async function () {
        await fs_tempdir(async function (d) {
            const tmp = fs_path_resolve(d, 'a/b/c/d/e');
            await fs_mkdirp(tmp);
            assert(await fs_fi(tmp).then(v => v.isDirectory()));
        });
    });
});
