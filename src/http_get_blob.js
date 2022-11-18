const axios = require('axios');

function http_get_blob(url, options)
{
    return axios.get(url, {responseType: 'blob', ...options}).then(v => v.data);
}

module.exports = http_get_blob;
