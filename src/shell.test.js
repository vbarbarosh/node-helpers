const assert = require('assert');
const shell = require('./shell');

describe('shell', function () {
    it('should resolve with raw stdout', async function () {
        assert.strictEqual(await shell([process.execPath, '-e', 'console.log("hello")']), 'hello\n');
    });
    it('should resolve with an empty string when there is no output', async function () {
        assert.strictEqual(await shell([process.execPath, '-e', '']), '');
    });
    it('should pass options through to execFile', async function () {
        const env = {...process.env, FOO1: 'bar1'};
        assert.strictEqual(await shell([process.execPath, '-e', 'console.log(process.env.FOO1)'], {env}), 'bar1\n');
    });
    it('should resolve with a Buffer when encoding is "buffer"', async function () {
        // an empty stderr Buffer is truthy: it must not be reported as an error
        const out = await shell([process.execPath, '-e', 'console.log("hello")'], {encoding: 'buffer'});
        assert(Buffer.isBuffer(out));
        assert.strictEqual(out.toString(), 'hello\n');
    });
    it('should throw on stderr output when encoding is "buffer"', async function () {
        await assert.rejects(shell([process.execPath, '-e', 'console.error("boom")'], {encoding: 'buffer'}), /STDERR/);
    });
    it('should throw on non-zero exit code', async function () {
        await assert.rejects(shell([process.execPath, '-e', 'process.exit(1)']));
    });
    it('should throw on stderr output', async function () {
        await assert.rejects(shell([process.execPath, '-e', 'console.error("boom")']), /STDERR/);
    });
});
