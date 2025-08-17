const fs_fi = require('./fs_fi');
const fs_path_join = require('./fs_path_join');
const fs_readdir = require('./fs_readdir');

async function fs_list_deep(path = '.')
{
    const out = [];
    const queue = [path];
    while (queue.length) {
        const fi = await fs_fi(queue.pop());
        out.push(fi);
        if (fi.isDirectory()) {
            const names = await fs_readdir(fi.pathname);
            queue.push(...names.map(v => fs_path_join(fi.pathname, v)));
        }
    }
    return out;
}

module.exports = fs_list_deep;
