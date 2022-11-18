const axios = require('axios');
const fs = require('fs');
const stream = require('stream');
const util = require('util');

const stream_finished = util.promisify(stream.finished);

// https://stackoverflow.com/a/61269447
function http_get_file(url, out_file, options)
{
    const ws = fs.createWriteStream(out_file);
    return axios.get(url, {responseType: 'stream', ...options}).then(function (response) {
        return stream_finished(response.data.pipe(ws));
    });
}

module.exports = http_get_file;
