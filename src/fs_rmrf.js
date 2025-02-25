const Promise = require('bluebird');
const fs_lstat = require('./fs_lstat');
const fs_path_join = require('./fs_path_join');
const fs_readdir = require('./fs_readdir');
const fs_rm = require('./fs_rm');
const fs_rmdir = require('./fs_rmdir');
const ignore = require('./ignore');

/**
 * Remove a file or directory, along with all nested files and directories, recursively.
 */
async function fs_rmrf(path, progress = ignore)
{
    const lstat = await fs_lstat(path).catch(() => null);
    if (lstat === null) {
        return;
    }

    if (lstat.isDirectory()) {
        const names = await fs_readdir(path);
        await Promise.all(names.map(v => fs_rmrf(fs_path_join(path, v), progress)));
        progress('rmdir', path);
        await fs_rmdir(path);
    }
    else {
        progress('rm', path);
        await fs_rm(path);
    }
}

module.exports = fs_rmrf;
