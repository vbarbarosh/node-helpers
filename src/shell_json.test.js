const assert = require('assert');
const shell_json = require('./shell_json');

describe('shell_json', function () {
    it('should parse stdout as json', async function () {
        const out = await shell_json([process.execPath, '-e', 'console.log(JSON.stringify({a: 1, b: [1, 2]}))']);
        assert.deepStrictEqual(out, {a: 1, b: [1, 2]});
    });
    it('should throw on invalid json', async function () {
        await assert.rejects(shell_json([process.execPath, '-e', 'console.log("not json")']), SyntaxError);
    });
    it('should throw on non-zero exit code', async function () {
        await assert.rejects(shell_json([process.execPath, '-e', 'process.exit(1)']));
    });
    it('should throw on stderr output', async function () {
        await assert.rejects(shell_json([process.execPath, '-e', 'console.error("boom")']), /STDERR/);
    });
});
