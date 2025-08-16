const Promise = require('bluebird');
const pid_exists = require('./pid_exists');

async function pid_kill_grace(pid, grace_timeout_ms = 5000)
{
    if (!process.kill(pid, 'SIGTERM')) {
        throw new Error('SIGTERM Failed');
    }

    const end = Date.now() + grace_timeout_ms;
    while (Date.now() < end) {
        if (!pid_exists(pid)) {
            return;
        }
        await Promise.delay(100);
    }

    if (!process.kill(pid, 'SIGKILL')) {
        throw new Error('SIGKILL Failed');
    }
}

module.exports = pid_kill_grace;
