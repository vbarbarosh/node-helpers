const axios = require('axios');
const safe_int = require('@vbarbarosh/type-helpers/src/safe_int');

async function http_get_stream(url, options)
{
    const res = await axios.get(url, {responseType: 'stream', ...options});
    const out = res.data;
    out.headers = res.headers;
    out.total = safe_int(res.headers['content-length'], null, 0);
    return out;
}

module.exports = http_get_stream;
