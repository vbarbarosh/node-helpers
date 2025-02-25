const fs = require('fs');

function fs_copy_excl(src, dest)
{
    return fs.promises.copyFile(src, dest, fs.constants.COPYFILE_EXCL);
}

module.exports = fs_copy_excl;
