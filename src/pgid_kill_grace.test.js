const assert = require('assert');
const pgid_exists = require('./pgid_exists');
const pgid_kill_grace = require('./pgid_kill_grace');
const shell_spawn = require('./shell_spawn');

describe('pgid_kill_grace', function() {

    it('happy path', async function () {
        const proc = await shell_spawn(['sleep', '1m'], {detached: true}).init();
        assert(pgid_exists(proc.pid));
        await pgid_kill_grace(proc.pid);
        assert(!pgid_exists(proc.pid));
    });

    // handling errors and edge cases

    it('should throw "Failed to send SIGTERM to process group 123"', async function () {
        const pgid = 999999; // 🎲 unlikely to exist
        assert(!pgid_exists(pgid));
        await assert.rejects(pgid_kill_grace(pgid), /Failed to send SIGTERM to process group \d+:/);
    });

    // kill(-0, SIGTERM) would terminate the caller's own group and
    // kill(-1, SIGTERM) every process of the user: reject before signalling
    [0, 1, -1, NaN, 1.5, undefined, null, '123'].forEach(function (pgid) {
        it(`should throw TypeError for ${String(pgid)} without sending a signal`, async function () {
            const logs = [];
            await assert.rejects(pgid_kill_grace(pgid, {log: s => logs.push(s)}), TypeError);
            assert.deepStrictEqual(logs, []);
        });
    });
});
