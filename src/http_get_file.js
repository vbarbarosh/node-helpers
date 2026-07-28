const axios = require('axios');
const fs = require('fs');
const fs_rename = require('./fs_rename');
const fs_rmf = require('./fs_rmf');
const random_hex = require('./random_hex');
const stream = require('stream');

// https://stackoverflow.com/a/61269447
async function http_get_file(url, out_file, options)
{
    const tmp_file = `${out_file}.${process.pid}.${random_hex(8)}.tmp`;
    try {
        const response = await axios.get(url, {responseType: 'stream', ...options});
        await stream.promises.pipeline(response.data, fs.createWriteStream(tmp_file, {
            flags: 'wx',
            flush: true,
        }));
        await fs_rename(tmp_file, out_file);
    }
    finally {
        await fs_rmf(tmp_file);
    }
}

module.exports = http_get_file;
