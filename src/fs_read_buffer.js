const fs_read = require('./fs_read');

async function fs_read_buffer(file)
{
    return await fs_read(file);
}

module.exports = fs_read_buffer;
