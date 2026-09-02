// group id == leader pid
// keep in sync with pid_exists
function pgid_exists(pgid)
{
    // kill(-0, ...) targets the caller's own group and kill(-1, ...) every
    // process the user may signal: never let such ids reach the kernel
    if (!Number.isInteger(pgid) || pgid <= 1) {
        throw new TypeError(`pgid_exists: invalid pgid: ${pgid}`);
    }
    try {
        process.kill(-pgid, 0);
        return true;
    }
    catch {
        return false;
    }
}

module.exports = pgid_exists;
