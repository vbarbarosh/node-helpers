const fs = require('fs');

function fs_rmdir(path)
{
    return fs.promises.rmdir(path);
}

module.exports = fs_rmdir;
