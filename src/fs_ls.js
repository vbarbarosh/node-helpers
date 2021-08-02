import Promise from 'bluebird';
import fs_fi from './fs_fi';
import fs_path_join from './fs_path_join';
import fs_readdir from './fs_readdir';

async function fs_ls(pathname = '.')
{
    const fi = await fs_fi(pathname);
    if (fi.isDirectory()) {
        const names = await fs_readdir(pathname);
        return Promise.all(names.map(v => fs_fi(fs_path_join(pathname, v))));
    }
    return [fi];
}

export default fs_ls;
