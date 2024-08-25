#!/usr/bin/env node

const cli = require('../../src/cli');
const shell_thru = require('../../src/shell_thru');
const shell_ytdlp_progress = require('../../src/shell_ytdlp_progress');

cli(main);

async function main()
{
    const url = 'https://www.youtube.com/watch?v=jvUpiexGOaw';
    // await shell_thru(['yt-dlp', url]).promise();
    await shell_ytdlp_progress(['--limit-rate=100K', url], {
        user_friendly_status: v => console.log(`Downloading: ${v}`),
    });
    user_friendly_status('🎉 Done');
}

function user_friendly_status(s)
{
    console.log(s);
}
