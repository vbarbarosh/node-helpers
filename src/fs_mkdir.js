const fs = require('fs');

function fs_mkdir(path, options)
{
    return fs.promises.mkdir(path, options);
}

module.exports = fs_mkdir;
