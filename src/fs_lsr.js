const Promise = require('bluebird');
const fs_fi = require('./fs_fi');
const fs_path_join = require('./fs_path_join');
const fs_readdir = require('./fs_readdir');

/**
 * @deprecated Deprecated in favor or fs_walk
 */
async function fs_lsr(pathname = '.')
{
    const fi = await fs_fi(pathname);
    const ret = [fi];
    if (fi.isDirectory()) {
        fi.content_size = 0;
        const names = await fs_readdir(pathname);
        const all = await Promise.all(names.map(v => fs_lsr(fs_path_join(pathname, v))));
        for (let i = 0, end = all.length; i < end; ++i) {
            const rows = all[i];
            ret.push(...rows);
            fi.content_size += rows[0].content_size;
        }
    }
    else {
        fi.content_size = fi.isFile() ? fi.size : 0;
    }
    return ret;
}

module.exports = fs_lsr;
