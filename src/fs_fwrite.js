const fs = require('fs');

/**
 * The main use case is writing chunks of data to a file.
 */
async function fs_fwrite(fp, buffer, offset = null)
{
    const {bytesWritten} = await new Promise(function (resolve, reject) {
        fs.write(fp, buffer, 0, buffer.length, offset, function (error, out) {
            error ? reject(error) : resolve(out);
        });
    });
    return bytesWritten;
}

module.exports = fs_fwrite;
