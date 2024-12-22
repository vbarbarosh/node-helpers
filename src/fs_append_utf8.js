const fs = require('fs');

function fs_append_utf8(file, text, options = {})
{
    return fs.promises.appendFile(file, text, options);
}

module.exports = fs_append_utf8;
