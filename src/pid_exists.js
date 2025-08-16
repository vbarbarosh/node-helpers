function pid_exists(pid)
{
    try {
        process.kill(pid, 0);
        return true;
    }
    catch {
        return false;
    }
}

module.exports = pid_exists;
