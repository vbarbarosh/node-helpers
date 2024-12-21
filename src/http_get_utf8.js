const axios = require('axios');

function http_get_utf8(url, options)
{
    return axios.get(url, {responseType: 'text', responseEncoding: 'utf8', ...options}).then(v => v.data);
}

module.exports = http_get_utf8;
