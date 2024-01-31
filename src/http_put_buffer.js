const axios = require('axios');

function http_put_buffer(url, body, options)
{
    return axios.put(url, body, options).then(v => v.data);
}

module.exports = http_put_buffer;
