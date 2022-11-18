const axios = require('axios');

function http_get_json(url, options)
{
    return axios.get(url, {responseType: 'json', ...options}).then(v => v.data);
}

module.exports = http_get_json;
