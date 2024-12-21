const fs = require('fs');

function fs_fclose(fp)
{
    return new Promise(function (resolve, reject) {
        fs.close(fp, function (error) {
            error ? reject(error) : resolve();
        });
    });
}

module.exports = fs_fclose;
