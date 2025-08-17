#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const shell_curl_progress = require('@vbarbarosh/node-helpers/src/shell_curl_progress');

cli(main);

async function main()
{
    const url = 'https://mirror.mangohost.net/ubuntu-releases/24.04.1/ubuntu-24.04.1-desktop-amd64.iso';

    await shell_curl_progress(['curl', '-sfS', url, '-o', 'a.iso'], {
        user_friendly_status: s => user_friendly_status(`Downloading: ${s}`),
    });

    user_friendly_status('🎉 Done');
}

function user_friendly_status(s)
{
    console.log(s);
}
