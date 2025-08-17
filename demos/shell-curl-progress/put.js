#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const shell_curl_progress = require('@vbarbarosh/node-helpers/src/shell_curl_progress');

cli(main);

async function main()
{
    // docker run --rm -p 3000:3000 vbarbarosh/dev-proxy
    const url = 'http://127.0.0.1:3000/null';

    await shell_curl_progress(['curl', '-sfS', url, '-T', 'a.iso'], {
        user_friendly_status: s => user_friendly_status(`Uploading: ${s}`),
    });

    user_friendly_status('🎉 Done');
}

function user_friendly_status(s)
{
    console.log(s);
}
