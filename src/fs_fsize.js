const fs_fstat = require('./fs_fstat');

function fs_fsize(fp)
{
    return fs_fstat(fp).then(v => v.size);
}

module.exports = fs_fsize;
