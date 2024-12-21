const fs = require('fs');

function fs_fopen(file, flags = 'r', mode = 0o666)
{
    return fs.promises.open(file, flags, mode);
}

module.exports = fs_fopen;
