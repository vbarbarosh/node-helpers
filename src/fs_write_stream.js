const fs = require('fs');

function fs_write_stream(path, options)
{
    return fs.createWriteStream(path, options);
}

module.exports = fs_write_stream;
