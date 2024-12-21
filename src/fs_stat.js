const fs = require('fs');

function fs_stat(path, options = {})
{
    return fs.promises.stat(path, options);
}

module.exports = fs_stat;
