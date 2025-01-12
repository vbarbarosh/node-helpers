const fs = require('fs');

function fs_read_stream(path, options)
{
    return fs.createReadStream(path, options);
}

module.exports = fs_read_stream;
