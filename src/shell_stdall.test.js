const assert = require('assert');
const shell_stdall = require('./shell_stdall');

describe('shell_stdall', function () {
    it('should resolve with both stdout and stderr', async function () {
        const out = await shell_stdall([process.execPath, '-e', 'console.log("out"); console.error("err")']);
        assert.deepStrictEqual(out, {stdout: 'out\n', stderr: 'err\n'});
    });
    it('should not treat stderr output as an error', async function () {
        const out = await shell_stdall([process.execPath, '-e', 'console.error("just a warning")']);
        assert.deepStrictEqual(out, {stdout: '', stderr: 'just a warning\n'});
    });
    it('should throw on non-zero exit code', async function () {
        await assert.rejects(shell_stdall([process.execPath, '-e', 'process.exit(1)']));
    });
});
