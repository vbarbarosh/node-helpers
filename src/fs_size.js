const fs_stat = require('./fs_stat');

async function fs_size(path)
{
    const stat = await fs_stat(path);
    return stat.size;
}

module.exports = fs_size;
