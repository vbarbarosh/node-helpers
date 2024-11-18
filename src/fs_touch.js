const fs = require('fs');

function fs_touch(file)
{
    return new Promise(function (resolve, reject) {
        fs.open(file, 'a', function (error, fd) {
            if (error) {
                if (error.code === 'EISDIR') {
                    reject(new Error(`Cannot touch a directory: ${file}`));
                }
                else {
                    reject(error);
                }
                return;
            }
            fs.close(fd, function (error) {
                if (error) {
                    reject(error);
                    return;
                }
                const now = new Date();
                fs.utimes(file, now, now, function (error) {
                    error ? reject(error) : resolve();
                });
            });
        });
    });
}

module.exports = fs_touch;
