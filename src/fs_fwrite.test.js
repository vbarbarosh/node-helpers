const assert = require('assert');
const fs_fclose = require('./fs_fclose');
const fs_fopen = require('./fs_fopen');
const fs_fwrite = require('./fs_fwrite');
const fs_path_resolve = require('./fs_path_resolve');
const fs_read_utf8 = require('./fs_read_utf8');
const fs_tempdir = require('./fs_tempdir');

describe('fs_fwrite', function () {
    it('should return the number of bytes written', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.bin');
            const fp = await fs_fopen(file, 'w');
            try {
                const out = await fs_fwrite(fp, Buffer.from('hello'));
                assert.strictEqual(out, 5);
            }
            finally {
                await fs_fclose(fp);
            }
            assert.strictEqual(await fs_read_utf8(file), 'hello');
        });
    });
    it('should write at an offset', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.bin');
            const fp = await fs_fopen(file, 'w');
            try {
                assert.strictEqual(await fs_fwrite(fp, Buffer.from('hello world')), 11);
                assert.strictEqual(await fs_fwrite(fp, Buffer.from('WORLD'), 6), 5);
            }
            finally {
                await fs_fclose(fp);
            }
            assert.strictEqual(await fs_read_utf8(file), 'hello WORLD');
        });
    });
});
