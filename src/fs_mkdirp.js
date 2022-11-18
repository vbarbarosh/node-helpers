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
            if (error.code == 'EEXIST') {
                break;
            }
            throw error;
        }
    }

    return pathname;
}

module.exports = fs_mkdirp;
