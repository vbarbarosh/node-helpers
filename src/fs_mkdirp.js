const fs_exists = require('./fs_exists');
const fs_mkdir = require('./fs_mkdir');
const fs_path_dirname = require('./fs_path_dirname');

async function fs_mkdirp(pathname)
{
    const parents = [];

    for (let p = pathname; p && p != '/'; p = fs_path_dirname(p)) {
        if (await fs_exists(p)) {
            break;
        }
        parents.push(p);
    }

    while (parents.length) {
        try {
            await fs_mkdir(parents.pop());
        }
        catch (error) {
            // Error: EEXIST: file already exists, mkdir [...]
            if (error.code === 'EEXIST') {
                // Exiting here is not correct. When two processes are running in parallel,
                // one tries to create `a/b/c` and another `a`. When second process creates
                // `a`, the first process will get `EEXIST` and stops (break) creating any
                // nested directories, which is not correct.
                // break;
                continue;
            }
            throw error;
        }
    }

    return pathname;
}

module.exports = fs_mkdirp;
