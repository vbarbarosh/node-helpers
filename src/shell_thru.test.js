const assert = require('assert');
const shell = require('./shell');
const shell_thru = require('./shell_thru');

describe('shell_thru', function () {
    it('should resolve when the command succeeds', async function () {
        await shell_thru([process.execPath, '-e', '']).promise();
    });
    it('should inherit stdio: child output goes to the parent streams', async function () {
        // Run shell_thru inside a child node; its grandchild's output must
        // surface on the child's own stdout for `shell` to capture.
        const script = `require(${JSON.stringify(require.resolve('./shell_thru'))})([process.execPath, '-e', 'console.log(123)']).promise();`;
        assert.strictEqual(await shell([process.execPath, '-e', script]), '123\n');
    });
    it('should reject on non-zero exit code', async function () {
        await assert.rejects(shell_thru([process.execPath, '-e', 'process.exit(3)']).promise(), /code 3/);
    });
});
