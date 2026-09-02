const assert = require('assert');
const pgid_exists = require('./pgid_exists');
const shell_spawn = require('./shell_spawn');
const wait_while = require('./wait_while');

describe('pgid_exists', function () {
    it('should return true for a running group and false after it exits', async function () {
        const proc = await shell_spawn(['sleep', '1m'], {detached: true}).init();
        assert.strictEqual(pgid_exists(proc.pid), true);
        process.kill(-proc.pid, 'SIGKILL');
        await wait_while(() => pgid_exists(proc.pid));
        assert.strictEqual(pgid_exists(proc.pid), false);
    });
    it('should return false for a group which does not exist', function () {
        assert.strictEqual(pgid_exists(999999), false); // 🎲 unlikely to exist
    });
    // kill(-0, 0) and kill(-1, 0) would succeed for the caller's own group
    // and for every process of the user: such ids must never be probed
    [0, 1, -1, NaN, 1.5, undefined, null, '123'].forEach(function (pgid) {
        it(`should throw TypeError for ${String(pgid)}`, function () {
            assert.throws(() => pgid_exists(pgid), TypeError);
        });
    });
});
