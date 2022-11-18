const axios = require('axios');
const qs = require('querystring');

function http_post_urlencoded(url, body, options)
{
    return axios.post(url, qs.stringify(body), options).then(v => v.data);
}

module.exports = http_post_urlencoded;
