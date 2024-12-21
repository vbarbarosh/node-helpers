const fs = require('fs');

/**
 * The main use case is reading chunks of data from a file.
 */
async function fs_fread(fp, buffer, offset = null, size = buffer.length)
{
    const {bytesRead} = await new Promise(function (resolve, reject) {
        fs.read(fp, buffer, 0, size, offset, function (error, out) {
            error ? reject(error) : resolve(out);
        });
    });
    return (bytesRead === buffer.length) ? buffer : buffer.subarray(0, bytesRead);
}

module.exports = fs_fread;
