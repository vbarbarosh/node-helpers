const axios = require('axios');

function http_patch_json(url, body, options)
{
    return axios.patch(url, body, options).then(v => v.data);
}

module.exports = http_patch_json;
