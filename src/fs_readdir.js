const fs = require('fs');

function fs_readdir(path, options)
{
    return fs.promises.readdir(path, options);
}

module.exports = fs_readdir;
