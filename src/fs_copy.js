const fs = require('fs');

function fs_copy(src, dest, mode)
{
    return fs.promises.copyFile(src, dest, mode);
}

module.exports = fs_copy;
