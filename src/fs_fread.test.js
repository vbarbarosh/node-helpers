const assert = require('assert');
const fs_fclose = require('./fs_fclose');
const fs_fopen = require('./fs_fopen');
const fs_fread = require('./fs_fread');
const fs_path_resolve = require('./fs_path_resolve');
const fs_tempdir = require('./fs_tempdir');
const fs_write = require('./fs_write');

describe('fs_fread', function () {
    it('should read only the requested number of bytes', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.bin');
            await fs_write(file, 'hello world');
            const fp = await fs_fopen(file);
            try {
                const chunk = await fs_fread(fp, Buffer.alloc(1024), 0, 5);
                assert.strictEqual(chunk.length, 5);
                assert.strictEqual(chunk.toString(), 'hello');
            }
            finally {
                await fs_fclose(fp);
            }
        });
    });
    it('should read from an offset', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.bin');
            await fs_write(file, 'hello world');
            const fp = await fs_fopen(file);
            try {
                const chunk = await fs_fread(fp, Buffer.alloc(1024), 6, 5);
                assert.strictEqual(chunk.toString(), 'world');
            }
            finally {
                await fs_fclose(fp);
            }
        });
    });
    it('should return a short chunk at the end of file', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.bin');
            await fs_write(file, 'hello world');
            const fp = await fs_fopen(file);
            try {
                const chunk = await fs_fread(fp, Buffer.alloc(1024), 0);
                assert.strictEqual(chunk.length, 11);
                assert.strictEqual(chunk.toString(), 'hello world');
            }
            finally {
                await fs_fclose(fp);
            }
        });
    });
    it('should return an empty chunk past the end of file', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.bin');
            await fs_write(file, 'hello world');
            const fp = await fs_fopen(file);
            try {
                const chunk = await fs_fread(fp, Buffer.alloc(1024), 100);
                assert.strictEqual(chunk.length, 0);
            }
            finally {
                await fs_fclose(fp);
            }
        });
    });
    it('should return the whole buffer when it is filled exactly', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'data.bin');
            await fs_write(file, 'hello world');
            const fp = await fs_fopen(file);
            try {
                const buffer = Buffer.alloc(11);
                const chunk = await fs_fread(fp, buffer, 0);
                assert.strictEqual(chunk, buffer);
                assert.strictEqual(chunk.toString(), 'hello world');
            }
            finally {
                await fs_fclose(fp);
            }
        });
    });
});
