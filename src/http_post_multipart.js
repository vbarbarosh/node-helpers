const FormData = require('form-data');
const axios = require('axios');

// Provide examples for the following common tasks:
//
// * send plain text
// * send json
// * send image
// * send attachment

// import fetch from 'node-fetch';
//
// async function http_post_multipart(url, rows)
// {
//     const form = new FormData();
//     for (let i = 0, end = rows.length; i < end; ++i) {
//         const {name, body} = rows[i];
//         form.append(name, body);
//     }
//     return await fetch(url, {method: 'POST', body: form});
// }
//
// Example:
//
// const rows = [];
// rows.push({name: 'from', body: MAILGUN_FROM});
// rows.push({name: 'to', body: to});
// rows.push({name: 'subject', body: subject});
// rows.push({name: 'text', body: text});
// rows.push({name: 'attachment', body: fs_read_stream(__filename), options: {filename: 'hello.txt'}});
// return http_post_multipart(`${MAILGUN_BASE}/messages`, rows, options);

// https://github.com/axios/axios/issues/318#issuecomment-344620216
// https://github.com/axios/axios/issues/1006#issuecomment-320165427
function http_post_multipart(url, items, options)
{
    const form = new FormData();
    for (let i = 0, end = items.length; i < end; ++i) {
        const item = items[i];
        // Without this, all string vales (ordinary fields) will
        // be empty in _Chrome 59.0.3071.86 (Official Build) (64-bit)_
        if (item.options) {
            form.append(item.name, item.body, item.options);
        }
        else {
            form.append(item.name, item.body);
        }
    }
    // For Node
    // import FormData from 'form-data'
    // noinspection JSUnresolvedVariable
    if (form.getHeaders) {
        const options2 = {...options};
        options2.headers = {...options2.headers, ...form.getHeaders()};
        return Promise.resolve(axios.post(url, form, options2)).then(v => v.data);
    }
    // For Browser
    // webpack.config.js
    //   externals: {"form-data": "FormData"}
    return Promise.resolve(axios.post(url, form, options)).then(v => v.data);
}

module.exports = http_post_multipart;
