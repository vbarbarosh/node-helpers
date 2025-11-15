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
        log(`Process is still alive, waiting (${format_thousands(end - Date.now())}ms left)`);
        await Promise.delay(Math.max(0, Math.min(100, end - Date.now())));
    }

    try {
        log('Sending SIGKILL');
        process.kill(pid, 'SIGKILL');
    }
    catch (error) {
        if (error.code === 'ESRCH' && error.syscall === 'kill') {
            return; // Process is not there anymore...
        }
        throw error;
    }

    // Process might still exist
    const final_deadline = Date.now() + 200;
    while (Date.now() < final_deadline) {
        if (!pid_exists(pid)) {
            return;
        }
        await Promise.delay(10);
    }

    throw new Error('Process survived SIGKILL');
}

module.exports = pid_kill_grace;
