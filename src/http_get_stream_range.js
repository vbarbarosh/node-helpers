const axios = require('axios');
const format_thousands = require('./format_thousands');
const parse_http_content_range = require('./parse_http_content_range');

async function http_get_stream_range(url, first, last)
{
    const a = Number.isInteger(first) ? first : '';
    const b = Number.isInteger(last) ? last : '';
    const headers = {Range: `bytes=${a}-${b}`};
    const res = await axios.get(url, {responseType: 'stream', headers});
    const out = res.data;
    out.headers = res.headers;
    if (res.headers['content-range']) {
        out.content_range = parse_http_content_range(res.headers['content-range']);
    }
    else {
        const len = res.headers['content-length'];
        out.content_range = parse_http_content_range(`${res.headers['accept-ranges']} 0-${len}/${len}`);
    }
    if (a && out.content_range.first !== a) {
        out.destroy(new Error(`First byte of a returned range (${format_thousands(out.content_range.first)}) is not as expected: [${format_thousands(a)}]`));
    }
    else if (b && out.content_range.last !== b) {
        out.destroy(new Error(`Last byte of a returned range (${format_thousands(out.content_range.last)}) is not as expected: [${format_thousands(b)}]`));
    }
    out.total = out.content_range.total;
    return out;
}

module.exports = http_get_stream_range;
