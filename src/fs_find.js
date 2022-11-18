const Promise = require('bluebird');
const fs_fi = require('./fs_fi');
const fs_path_resolve = require('./fs_path_resolve');
const fs_readdir = require('./fs_readdir');

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

module.exports = fs_find;
