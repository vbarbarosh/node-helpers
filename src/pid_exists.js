// keep in sync with pgid_exists
function pid_exists(pid)
{
    // kill(0, ...) targets the caller's own group and kill(-1, ...) every
    // process the user may signal: never let such ids reach the kernel
    if (!Number.isInteger(pid) || pid <= 1) {
        throw new TypeError(`pid_exists: invalid pid: ${pid}`);
    }
    try {
        process.kill(pid, 0);
        return true;
    }
    catch {
        return false;
    }
}

module.exports = pid_exists;
