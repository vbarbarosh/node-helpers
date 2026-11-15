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
    it('should write everything queued for a pipe before it exits', async function () {
        const {code, stdout, stderr} = await run_late_reader(`require(${CLI})(async () => { process.stdout.write('x'.repeat(200000)); process.stderr.write('y'.repeat(200000)); throw new (require(${EXIT_CODE_ERROR}))(3, 'boom'); }, () => console.error('reported'));`);
        assert.strictEqual(code, 3);
        assert.strictEqual(stdout.length, 200000);
        assert.strictEqual(stderr, 'y'.repeat(200000) + 'reported\n');
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

// Reads the child's output only once it has exited, or after 500 ms if it
// has not: whatever it left queued for the pipe when it exited is lost
function run_late_reader(script)
{
    return new Promise(function (resolve, reject) {
        const child = child_process.spawn(process.execPath, ['-e', script]);
        const stdout = [];
        const stderr = [];
        const timer = setTimeout(read, 500);
        child.once('exit', read);
        child.on('error', reject);
        child.on('close', function (code) {
            resolve({code, stdout: Buffer.concat(stdout).toString(), stderr: Buffer.concat(stderr).toString()});
        });
        function read() {
            clearTimeout(timer);
            child.removeListener('exit', read);
            child.stdout.on('data', v => stdout.push(v));
            child.stderr.on('data', v => stderr.push(v));
        }
    });
}
