#!/usr/bin/env node

const cli = require('../../src/cli');
const shell_curl_progress = require('../../src/shell_curl_progress');

cli(main);

async function main()
{
    const url = 'https://releases.ubuntu.com/22.04.4/ubuntu-22.04.4-desktop-amd64.iso';

    await shell_curl_progress(['curl', '-sfS', url, '-o', 'a.iso'], {
        user_friendly_status: s => user_friendly_status(`Downloading: ${s}`),
    });

    user_friendly_status('🎉 Done');
}

function user_friendly_status(s)
{
    console.log(s);
}
