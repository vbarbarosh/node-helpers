const fs = require('fs');
const util = require('util');

// https://nodejs.org/api/util.html#util_util_promisify_original
const read = util.promisify(fs.read);

// Main use case is for reading chunks of data from file.

async function fs_fread(fp, buffer, offset = null)
{
    const {bytesRead} = await read(fp, buffer, 0, buffer.length, offset);
    return (bytesRead == buffer.length) ? buffer : buffer.slice(0, bytesRead);
}

module.exports = fs_fread;
