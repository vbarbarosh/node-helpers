const fs_stat = require('./fs_stat');

async function fs_size(file)
{
    const stat = await fs_stat(file);
    return stat.size;
}

module.exports = fs_size;
