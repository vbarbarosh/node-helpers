const Promise = require('bluebird');
const fs_fi = require('./fs_fi');
const fs_path_resolve = require('./fs_path_resolve');
const fs_readdir = require('./fs_readdir');
const fs_rm = require('./fs_rm');
const fs_rmdir = require('./fs_rmdir');

/**
 * Remove a file or directory, along with all nested files and directories, recursively.
 */
async function fs_rmrf(pathname)
{
    const fi = await fs_fi(pathname).catch(() => null);
    if (fi === null) {
        return;
    }

    if (fi.isDirectory()) {
        const names = await fs_readdir(pathname);
        await Promise.all(names.map(v => fs_rmrf(fs_path_resolve(pathname, v))));
        await fs_rmdir(fi.pathname);
    }
    else {
        await fs_rm(fi.pathname);
    }
}

module.exports = fs_rmrf;
