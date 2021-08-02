import fs_lstat from './fs_lstat';
import fs_mkdir from './fs_mkdir';
import fs_path_dirname from './fs_path_dirname';

async function fs_mkdirp(pathname)
{
    const parents = [];

    for (let p = pathname; p && p != '/'; p = fs_path_dirname(p)) {
        try {
            await fs_lstat(p);
            break;
        }
        catch (error) {
            parents.unshift(p);
        }
    }

    for (let i = 0, end = parents.length; i < end; ++i) {
        await fs_mkdir(parents[i]);
    }

    return pathname;
}

export default fs_mkdirp;
