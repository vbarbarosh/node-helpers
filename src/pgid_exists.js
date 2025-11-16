// group id == leader pid
// keep in sync with pid_exists
function pgid_exists(pgid)
{
    try {
        process.kill(-pgid, 0);
        return true;
    }
    catch {
        return false;
    }
}

module.exports = pgid_exists;
