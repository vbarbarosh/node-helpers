const fs_fi = require('./fs_fi');

async function fs_size(file)
{
    return fs_fi(file).then(v => v.size);
}

module.exports = fs_size;
