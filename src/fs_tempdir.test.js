const assert = require('assert');
const fs = require('fs');
const fs_tempdir = require('./fs_tempdir');

describe('fs_tempdir', function () {
    it('should resolve with the fn result and remove the directory', async function () {
        let dir;
        const result = await fs_tempdir(async function (d) {
            dir = d;
            assert.ok(fs.existsSync(d));
            return 'result1';
        });
        assert.strictEqual(result, 'result1');
        assert.ok(!fs.existsSync(dir));
    });
    it('should remove the directory when fn throws', async function () {
        let dir;
        await assert.rejects(fs_tempdir(async function (d) {
            dir = d;
            throw new Error('boom');
        }), /boom/);
        assert.ok(!fs.existsSync(dir));
    });
    it('should share a single SIGINT listener across concurrent calls', async function () {
        const before = process.listenerCount('SIGINT');
        const seen = [];
        await Promise.all(Array.from({length: 15}, () => fs_tempdir(async function () {
            seen.push(process.listenerCount('SIGINT'));
        })));
        assert.deepStrictEqual([...new Set(seen)], [before + 1]);
        assert.strictEqual(process.listenerCount('SIGINT'), before);
    });
});
