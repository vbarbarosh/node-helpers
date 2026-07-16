const assert = require('assert');
const child_process = require('child_process');

const CLI = JSON.stringify(require.resolve('./cli'));
const EXIT_CODE_ERROR = JSON.stringify(require.resolve('./errors/ExitCodeError'));

describe('cli', function () {
    it('should exit 0 when main resolves', async function () {
        const {code, stdout} = await run(`require(${CLI})(async () => console.log('done'));`);
        assert.strictEqual(code, 0);
        assert.match(stdout, /done/);
    });
    it('should report a rejection and exit 1', async function () {
        const {code, stdout} = await run(`require(${CLI})(async () => { throw new Error('boom'); }, e => console.log('reported:' + e.message));`);
        assert.strictEqual(code, 1);
        assert.match(stdout, /reported:boom/);
    });
    it('should exit with exit_code of a rejected ExitCodeError', async function () {
        const {code} = await run(`require(${CLI})(async () => { throw new (require(${EXIT_CODE_ERROR}))(42, 'boom'); }, e => console.log('reported'));`);
        assert.strictEqual(code, 42);
    });
    it('should report a synchronous throw and exit 1', async function () {
        const {code, stdout} = await run(`require(${CLI})(function () { throw new Error('sync boom'); }, e => console.log('reported:' + e.message));`);
        assert.strictEqual(code, 1);
        assert.match(stdout, /reported:sync boom/);
    });
    it('should exit with exit_code of a synchronously thrown ExitCodeError', async function () {
        const {code, stdout} = await run(`require(${CLI})(function () { throw new (require(${EXIT_CODE_ERROR}))(42, 'boom'); }, e => console.log('reported'));`);
        assert.strictEqual(code, 42);
        assert.match(stdout, /reported/);
    });
});

function run(script)
{
    return new Promise(function (resolve) {
        child_process.execFile(process.execPath, ['-e', script], function (error, stdout, stderr) {
            resolve({code: error ? error.code : 0, stdout, stderr});
        });
    });
}
