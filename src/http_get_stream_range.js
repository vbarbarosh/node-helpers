const axios = require('axios');
const parse_http_content_range = require('./parse_http_content_range');

async function http_get_stream_range(url, begin, end)
{
    const a = Number.isInteger(begin) ? begin : '';
    const b = Number.isInteger(end) ? (end - 1) : '';
    const headers = {Range: `bytes=${a}-${b}`};
    const res = await axios.get(url, {responseType: 'stream', headers});
    const out = res.data;
    out.content_range = parse_http_content_range(res.headers['content-range']);
    if (a && out.content_range.first !== a) {
        out.destroy(new Error(`First byte of a returned range (${format_thousands(out.content_range.first)}) is not as expected: [${format_thousands(a)}]`));
    }
    else if (b && out.content_range.last !== b) {
        out.destroy(throw new Error(`Last byte of a returned range (${format_thousands(out.content_range.last)}) is not as expected: [${format_thousands(b)}]`));
    }
    return out;
}

module.exports = http_get_stream_range;
