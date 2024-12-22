const fs = require('fs');

function fs_append(file, data, options = {})
{
    return fs.promises.appendFile(file, data, options);
}

module.exports = fs_append;
