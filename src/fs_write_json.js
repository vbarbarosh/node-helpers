const fs = require('fs');

async function fs_write_json(file, data)
{
    return fs.promises.writeFile(file, JSON.stringify(data, null, 4));
}

module.exports = fs_write_json;
