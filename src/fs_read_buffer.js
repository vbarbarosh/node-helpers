const fs_read = require('./fs_read');

function fs_read_buffer(file)
{
    return fs_read(file);
}

module.exports = fs_read_buffer;
