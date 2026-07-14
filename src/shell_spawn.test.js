const assert = require('assert');
const pid_exists = require('./pid_exists');
const shell_spawn = require('./shell_spawn');
const wait_while = require('./wait_while');

describe('shell_spawn', function () {
    describe('Happy Path', function () {
        it('basic', async function () {
            await shell_spawn(['true']).promise().timeout(1000);
        });
        it('init + promise', async function () {
            const proc = await shell_spawn(['true']).init();
            await proc.promise().timeout(1000);
        });
    });
    it('🏎️ race condition: proc.promise is called after process was terminated', async function () {
        const proc = shell_spawn(['true']);
        assert(pid_exists(proc.pid));
        // Poll instead of a fixed delay: on a loaded machine even `true`
        // may need more than a few milliseconds to exit and be reaped.
        await wait_while(() => pid_exists(proc.pid));
        assert(!pid_exists(proc.pid));
        await proc.promise().timeout(1000);
    });
    it('should throw when init fails', async function () {
        await assert.rejects(shell_spawn(['ggg111']).init(), /^Error: spawn ggg111 ENOENT$/);
    });
    it('should throw when process exists with non zero code', async function () {
        const proc = await shell_spawn(['false']).init();
        await assert.rejects(proc.promise().timeout(1000), /^Error: Process terminated with code 1 and signal null$/);
    });
});
