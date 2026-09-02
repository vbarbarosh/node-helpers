const Promise = require('bluebird');
const format_thousands = require('./format_thousands');
const ignore = require('./ignore');
const pid_exists = require('./pid_exists');

// keep in sync with pgid_kill_grace
async function pid_kill_grace(pid, {grace_timeout_ms = 5000, log = ignore} = {})
{
    // kill(0, ...) targets the caller's own group and kill(-1, ...) every
    // process the user may signal: never let such ids reach the kernel
    if (!Number.isInteger(pid) || pid <= 1) {
        throw new TypeError(`pid_kill_grace: invalid pid: ${pid}`);
    }
    log(`Terminating process ${pid}: sending SIGTERM`);
    try {
        process.kill(pid, 'SIGTERM');
    }
    catch (error) {
        throw new Error(`Failed to send SIGTERM to process ${pid}: ${error.message}`, {cause: error});
    }

    const end = Date.now() + grace_timeout_ms;
    while (true) {
        if (!pid_exists(pid)) {
            return;
        }
        if (Date.now() >= end) {
            break;
        }
        const remain = end - Date.now();
        log(`Process ${pid} still alive; grace time remaining: ${format_thousands(remain)}ms`);
        await Promise.delay(Math.max(0, Math.min(100, remain)));
    }

    try {
        log(`SIGTERM grace period expired for process ${pid}; sending SIGKILL`);
        process.kill(pid, 'SIGKILL');
    }
    catch (error) {
        if (error.code === 'ESRCH' && error.syscall === 'kill') {
            log(`Process ${pid} already terminated`);
            return;
        }
        throw error;
    }

    // Give kernel a moment to deliver SIGKILL
    const final_deadline = Date.now() + 200;
    while (Date.now() < final_deadline) {
        if (!pid_exists(pid)) {
            return;
        }
        await Promise.delay(10);
    }

    throw new Error(`Process ${pid} survived SIGKILL`);
}

module.exports = pid_kill_grace;
