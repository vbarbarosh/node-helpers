const axios = require('axios');

function http_head(url, options)
{
    return axios.head(url, options).then(v => v.request.res.headers);
}

module.exports = http_head;
