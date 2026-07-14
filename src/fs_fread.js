const fs = require('fs');

/**
 * The main use case is reading chunks of data from a file.
 */
async function fs_fread(fp, buffer, offset = null, size = buffer.length)
{
    const bytes_read = await new Promise(function (resolve, reject) {
        fs.read(fp, buffer, 0, size, offset, function (error, out) {
            error ? reject(error) : resolve(out);
        });
    });
    return (bytes_read === buffer.length) ? buffer : buffer.subarray(0, bytes_read);
}

module.exports = fs_fread;
