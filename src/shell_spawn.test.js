const Promise = require('bluebird');
const assert = require('assert');
const pid_exists = require('./pid_exists');
const shell_spawn = require('./shell_spawn');

describe.skip('shell_spawn', function () {
    describe('Happy Path', function () {
        it('basic', async function () {
            await shell_spawn(['true']).promise().timeout(100);
        });
        it('init + promise', async function () {
            const proc = await shell_spawn(['true']).init();
            await proc.promise().timeout(100);
        });
    });
    it('🏎️ race condition: proc.promise is called after process was terminated', async function () {
        const proc = shell_spawn(['true']);
        assert(pid_exists(proc.pid));
        await Promise.delay(10);
        assert(!pid_exists(proc.pid));
        await proc.promise().timeout(100);
    });
});
