const Promise = require('bluebird');
const fs_lstat = require('./fs_lstat');
const fs_path_resolve = require('./fs_path_resolve');
const fs_readdir = require('./fs_readdir');
const fs_rm = require('./fs_rm');
const fs_rmdir = require('./fs_rmdir');

/**
 * Remove a file or directory, along with all nested files and directories, recursively.
 */
async function fs_rmrf(path)
{
    const lstat = await fs_lstat(path).catch(() => null);
    if (lstat === null) {
        return;
    }

    if (lstat.isDirectory()) {
        const names = await fs_readdir(path);
        await Promise.all(names.map(v => fs_rmrf(fs_path_resolve(path, v))));
        await fs_rmdir(path);
    }
    else {
        await fs_rm(path);
    }
}

module.exports = fs_rmrf;
