const Promise = require('bluebird');
const format_thousands = require('./format_thousands');
const ignore = require('./ignore');
const pgid_exists = require('./pgid_exists');

// group id == leader pid
// keep in sync with pid_kill_grace
async function pgid_kill_grace(pgid, {grace_timeout_ms = 5000, log = ignore} = {})
{
    log(`Terminating process group ${pgid}: sending SIGTERM`);
    try {
        process.kill(-pgid, 'SIGTERM');
    }
    catch (error) {
        throw new Error(`Failed to send SIGTERM to process group ${pgid}: ${error.message}`);
    }

    const end = Date.now() + grace_timeout_ms;
    while (true) {
        if (!pgid_exists(pgid)) {
            return;
        }
        if (Date.now() >= end) {
            break;
        }
        const remain = end - Date.now();
        log(`Process group ${pgid} still alive; waiting ${format_thousands(remain)}ms`);
        await Promise.delay(Math.max(0, Math.min(100, remain)));
    }

    try {
        log(`SIGTERM grace period expired for group ${pgid}; sending SIGKILL`);
        process.kill(-pgid, 'SIGKILL');
    }
    catch (error) {
        if (error.code === 'ESRCH' && error.syscall === 'kill') {
            log(`Process group ${pgid} already terminated`);
            return;
        }
        throw error;
    }

    // Wait for kernel to deliver SIGKILL
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
