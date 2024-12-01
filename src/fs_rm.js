const Promise = require('bluebird');
const fs = require('fs');

/**
 * Remove a file
 *
 * @link https://nodejs.org/api/fs.html#fsunlinkpath-callback
 */
async function fs_rm(filename)
{
    await new Promise(function (resolve, reject) {
        fs.unlink(filename, function (error) {
            error ? reject(error) : resolve();
        });
    });
}

module.exports = fs_rm;
