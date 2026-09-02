const assert = require('assert');
const pid_exists = require('./pid_exists');
const pid_kill_grace = require('./pid_kill_grace');
const shell_spawn = require('./shell_spawn');
const stream = require('stream');
const stream_each = require('./stream_each');
const stream_lines = require('./stream_lines');
const wait_while = require('./wait_while');

describe('pid_kill_grace', function() {

    it('happy path', async function () {
        const proc = await shell_spawn(['sleep', '1m']).init();
        assert(pid_exists(proc.pid));
        await pid_kill_grace(proc.pid);
        assert(!pid_exists(proc.pid));
    });

    // handling errors and edge cases

    it('should throw "Failed to send SIGTERM to process 123"', async function () {
        const pid = 999999; // 🎲 unlikely to exist
        assert(!pid_exists(pid));
        await assert.rejects(pid_kill_grace(pid), /Failed to send SIGTERM to process \d+:/);
    });

    // kill(0, SIGTERM) would terminate the caller's own group and
    // kill(-1, SIGTERM) every process of the user: reject before signalling
    [0, 1, -1, NaN, 1.5, undefined, null, '123'].forEach(function (pid) {
        it(`should throw TypeError for ${String(pid)} without sending a signal`, async function () {
            const logs = [];
            await assert.rejects(pid_kill_grace(pid, {log: s => logs.push(s)}), TypeError);
            assert.deepStrictEqual(logs, []);
        });
    });

    it.skip('should throw "Process 123 survived SIGKILL"', async function () {
        // How to implement this behavior?
    });

    it('should KILL process after grace period', async function () {
        const logs = [];
        const stdout = [];
        const proc = shell_spawn([`${__dirname}/pid_kill_grace.d/ignore-sigterm.js`]);
        const r = stream.promises.pipeline(proc.stdout, stream_lines(), stream_each(v => stdout.push(v)));
        await wait_while(() => !stdout.length);
        await Promise.all([
            r,
            pid_kill_grace(proc.pid, {grace_timeout_ms: 50, log: s => logs.push(s)})
        ]);
        assert(!pid_exists(proc.pid));
        assert(stdout.some(v => v.includes('SIGTERM_ignoring')));
        assert(logs.some(v => v.match(/Terminating process \d+: sending SIGTERM/)));
        assert(logs.some(v => v.match(/SIGTERM grace period expired for process \d+; sending SIGKILL/)));
    });

    it('Child ignores SIGTERM for 10ms, but dies naturally before the grace loop ends', async function () {
        const logs = [];
        const stdout = [];
        const proc = shell_spawn([`${__dirname}/pid_kill_grace.d/ignore-sigterm-for-10ms.js`]);
        const r = stream.promises.pipeline(proc.stdout, stream_lines(), stream_each(v => stdout.push(v)));
        await wait_while(() => !stdout.length);
        await Promise.all([
            r,
            pid_kill_grace(proc.pid, {grace_timeout_ms: 50, log: s => logs.push(s)})
        ]);
        assert(!pid_exists(proc.pid));
        assert(stdout.some(v => v.includes('SIGTERM_ignoring')));
        assert(stdout.some(v => v.includes('TERMINATE_AFTER_10MS')));
        assert(logs.some(v => v.match(/Terminating process \d+: sending SIGTERM/)));
        assert(!logs.some(v => v.match(/SIGTERM grace period expired for process \d+; sending SIGKILL/)));
    });
});
