import Promise from 'bluebird';
import fs_fi from './fs_fi';
import fs_rm from './fs_rm';
import fs_rmdir from './fs_rmdir';
import fs_path_resolve from './fs_path_resolve';
import fs_readdir from './fs_readdir';

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

export default fs_rmrf;
