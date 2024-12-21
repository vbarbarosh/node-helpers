const fs = require('fs');

function fs_fstat(fp, options = {})
{
    return new Promise(function (resolve, reject) {
        fs.fstat(fp, options, function (error, out) {
            error ? reject(error) : resolve(out);
        });
    })
}

module.exports = fs_fstat;
