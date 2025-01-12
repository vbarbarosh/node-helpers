const fs = require('fs');

async function fs_exists(path)
{
    return new Promise(function (resolve) {
        fs.access(path, error => resolve(!error));
    });
}

module.exports = fs_exists;
