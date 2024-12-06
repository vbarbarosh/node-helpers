const fs_read = require('./fs_read');

/**
 * Read the entire contents of a file into a UTF-8 encoded string.
 */
function fs_read_utf8(file)
{
    return fs_read(file, {encoding: 'utf8'});
}

module.exports = fs_read_utf8;
