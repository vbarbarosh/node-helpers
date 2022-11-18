const fs = require('fs');

async function fs_exists(path)
{
    return new Promise(function (resolve) {
        fs.access(path, function (error) {
            error ? resolve(false) : resolve(true);
        });
    });
}

module.exports = fs_exists;
