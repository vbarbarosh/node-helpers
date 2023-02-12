const fs_read = require('./fs_read');

function fs_read_utf8(file)
{
    return fs_read(file, {encoding: 'utf8'});
}

module.exports = fs_read_utf8;
