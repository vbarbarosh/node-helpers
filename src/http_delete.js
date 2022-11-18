const axios = require('axios');

function http_delete(url, options)
{
    return axios.delete(url, {responseType: 'json', ...options}).then(v => v.data);
}

module.exports = http_delete;
