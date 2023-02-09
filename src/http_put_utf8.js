const axios = require('axios');

async function http_put_utf8(url, utf8, options)
{
    return axios.put(url, utf8, options).then(v => v.data);
}

module.exports = http_put_utf8;
