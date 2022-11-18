const axios = require('axios');

function http_get_buffer(url, options)
{
    return axios.get(url, {responseType: 'arraybuffer', ...options}).then(v => v.data);
}

module.exports = http_get_buffer;
