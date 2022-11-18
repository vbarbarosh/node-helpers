const fs = require('fs');
const util = require('util');

// https://nodejs.org/api/util.html#util_util_promisify_original
const write = util.promisify(fs.write);

// Main use case is for writing chunks of data to file.

async function fs_fwrite(fp, buffer, offset = null)
{
    const {bytesWritten} = await write(fp, buffer, 0, buffer.length, offset);
    return bytesWritten;
}

module.exports = fs_fwrite;
