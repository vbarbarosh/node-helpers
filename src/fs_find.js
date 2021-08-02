import Promise from 'bluebird';
import fs_fi from './fs_fi';
import fs_path_resolve from './fs_path_resolve';
import fs_readdir from './fs_readdir';

async function fs_find(pathname = '.')
{
    const fi = await fs_fi(fs_path_resolve(pathname));
    if (fi.isDirectory()) {
        const names = await fs_readdir(pathname);
        const rows = await Promise.all(names.map(v => fs_find(fs_path_resolve(pathname, v))));
        const out = [fi];
        for (let i = 0, end = rows.length; i < end; ++i) {
            out.push(...rows[i]);
        }
        return out;
    }
    return [fi];
}

export default fs_find;
