const fs = require('fs');

function fs_fopen(file, flags = 'r', mode = 0o666)
{
    return new Promise(function (resolve, reject) {
        fs.open(file, flags, mode, function (error, out) {
            error ? reject(error) : resolve(out);
        });
    });
}

module.exports = fs_fopen;
