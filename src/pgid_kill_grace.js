const Promise = require('bluebird');
const format_thousands = require('./format_thousands');
const ignore = require('./ignore');
const pgid_exists = require('./pgid_exists');

// group id == leader pid
// keep in sync with pid_kill_grace
async function pgid_kill_grace(pgid, {grace_timeout_ms = 5000, log = ignore} = {})
{
    log(`Terminating process group ${pgid}: sending SIGTERM`);
    if (!process.kill(-pgid, 'SIGTERM')) {
        throw new Error('SIGTERM Failed');
    }

    const end = Date.now() + grace_timeout_ms;
    while (true) {
        if (!pgid_exists(pgid)) {
            return;
        }
        if (Date.now() >= end) {
            break;
        }
        log(`Process group ${pgid} still alive; waiting ${format_thousands(end - Date.now())}ms`);
        await Promise.delay(Math.max(0, Math.min(100, end - Date.now())));
    }

    try {
        log(`SIGTERM grace period expired for group ${pgid}; sending SIGKILL`);
        process.kill(-pgid, 'SIGKILL');
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
        if (!pgid_exists(pgid)) {
            return;
        }
        await Promise.delay(10);
    }

    throw new Error(`Process group ${pgid} survived SIGKILL`);
}

module.exports = pgid_kill_grace;
