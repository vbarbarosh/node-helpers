import fs_exists from './fs_exists';
import fs_mkdir from './fs_mkdir';
import fs_path_dirname from './fs_path_dirname';

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
        await fs_mkdir(parents.pop());
    }

    return pathname;
}

export default fs_mkdirp;
