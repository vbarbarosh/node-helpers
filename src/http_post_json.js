const axios = require('axios');

function http_post_json(url, body, options)
{
    return axios.post(url, body, options).then(v => v.data);
}

module.exports = http_post_json;
