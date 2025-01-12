const fs = require('fs');

function fs_lstat(path, options)
{
    return fs.promises.lstat(path, options);
}

module.exports = fs_lstat;
