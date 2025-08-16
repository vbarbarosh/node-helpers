const Promise = require('bluebird');
const format_thousands = require('./format_thousands');
const ignore = require('./ignore');
const pid_exists = require('./pid_exists');

async function pid_kill_grace(pid, {grace_timeout_ms = 5000, log = ignore} = {})
{
    log('Sending SIGTERM');
    if (!process.kill(pid, 'SIGTERM')) {
        throw new Error('SIGTERM Failed');
    }

    const end = Date.now() + grace_timeout_ms;
    while (Date.now() < end) {
        if (!pid_exists(pid)) {
            return;
        }
        log(`Process is still there, waiting for 100ms, ${format_thousands(end - Date.now())}ms left`);
        await Promise.delay(100);
    }

    log('Sending SIGKILL');
    if (!process.kill(pid, 'SIGKILL')) {
        throw new Error('SIGKILL Failed');
    }
}

module.exports = pid_kill_grace;
