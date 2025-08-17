const Promise = require('bluebird');
const fs_fi = require('./fs_fi');
const fs_path_join = require('./fs_path_join');
const fs_readdir = require('./fs_readdir');

async function fs_list(pathname = '.')
{
    const fi = await fs_fi(pathname);
    if (fi.isDirectory()) {
        const names = await fs_readdir(pathname);
        return Promise.all(names.map(v => fs_fi(fs_path_join(pathname, v))));
    }
    return [fi];
}

module.exports = fs_list;
