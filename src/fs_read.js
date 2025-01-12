const fs = require('fs');

function fs_read(path, options)
{
    return fs.promises.readFile(path, options);
}

module.exports = fs_read;
