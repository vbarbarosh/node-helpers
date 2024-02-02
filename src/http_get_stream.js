const axios = require('axios');

function http_get_stream(url, options)
{
    return axios.get(url, {responseType: 'stream', ...options}).then(v => v.data);
}

module.exports = http_get_stream;
