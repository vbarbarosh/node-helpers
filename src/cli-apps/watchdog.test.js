const assert = require('assert');
const pid_exists = require('../pid_exists');
const shell_spawn = require('../shell_spawn');
const stream = require('stream');
const stream_each = require('../stream_each');
const stream_lines = require('../stream_lines');

// watchdog true -> race condition; true exists too quickly; bug in shell_spawn

describe('watchdog', function () {
    this.timeout(1000);
    it('Happy Path', async function () {
        const env = {...process.env, WATCHDOG_INTERVAL: 100, __TESTING__: 1};
        const proc = shell_spawn([`${__dirname}/watchdog.js`, `${__dirname}/watchdog.d/quick-exit-after-2-pings.js`], {env});
        try {
            const stdout = [];
            await Promise.all([
                stream.promises.pipeline(proc.stdout, stream_lines(), stream_each(v => stdout.push(v))),
                proc.promise(),
            ]);
            assert.strictEqual(stdout.filter(v => v.includes('[watchdog_ping]')).length, 2);
            assert.strictEqual(stdout.filter(v => v.includes('[watchdog_end_ok] pings=2')).length, 1);
        }
        finally {
            if (pid_exists(proc.pid)) {
                process.kill(proc.pid, 'SIGTERM');
            }
        }
    });
    it('Hang after 1 ping', async function () {
        const env = {...process.env, WATCHDOG_INTERVAL: 100, __TESTING__: 1};
        const proc = shell_spawn([`${__dirname}/watchdog.js`, `${__dirname}/watchdog.d/quick-hang-after-1-ping.js`], {env});
        const stdout = [];
        try {
            await Promise.all([
                stream.promises.pipeline(proc.stdout, stream_lines(), stream_each(v => stdout.push(v))),
                assert.rejects(proc.promise().timeout(500), {message: 'Process terminated with code 124 and signal null'}),
            ]);
            assert.strictEqual(stdout.filter(v => v.includes('[watchdog_ping]')).length, 1);
            assert.strictEqual(stdout.filter(v => v.includes('[watchdog_end_error] pings=1 | No heartbeat for the last 100ms')).length, 1);
        }
        finally {
            if (pid_exists(proc.pid)) {
                process.kill(proc.pid, 'SIGTERM');
            }
        }
    });
});
