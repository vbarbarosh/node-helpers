const fs_read = require('./fs_read');

/**
 * Read the entire contents of a file into a buffer.
 */
function fs_read_buffer(file)
{
    return fs_read(file);
}

module.exports = fs_read_buffer;
