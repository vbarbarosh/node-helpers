const fs = require('fs');

/**
 * Remove a file
 */
function fs_rm(path)
{
    return fs.promises.unlink(path);
}

module.exports = fs_rm;
