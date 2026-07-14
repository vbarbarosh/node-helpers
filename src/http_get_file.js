const axios = require('axios');
const fs = require('fs');
const stream = require('stream');

// https://stackoverflow.com/a/61269447
async function http_get_file(url, out_file, options)
{
    // Create out_file only after a successful response: a failed request
    // (e.g. 404) should not leave an empty file behind.
    const response = await axios.get(url, {responseType: 'stream', ...options});
    // pipeline destroys both streams on any failure: an aborted download
    // rejects instead of hanging forever, an unwritable out_file rejects
    // instead of raising an uncaught 'error' event.
    await stream.promises.pipeline(response.data, fs.createWriteStream(out_file));
}

module.exports = http_get_file;
