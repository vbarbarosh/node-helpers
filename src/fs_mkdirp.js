const fs = require('fs');

async function fs_mkdirp(pathname)
{
    // Unlike the native call, resolves with `pathname` (handy for chaining).
    await fs.promises.mkdir(pathname, {recursive: true});
    return pathname;
}

module.exports = fs_mkdirp;
