const fs = require('fs');

async function fs_write(file, data, options = {})
{
    return fs.promises.writeFile(file, data, options);
}

module.exports = fs_write;
