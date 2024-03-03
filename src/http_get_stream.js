const axios = require('axios');

async function http_get_stream(url, options)
{
    const res = await axios.get(url, {responseType: 'stream', ...options});
    const out = res.data;
    out.headers = res.headers;
    return out;
}

module.exports = http_get_stream;
