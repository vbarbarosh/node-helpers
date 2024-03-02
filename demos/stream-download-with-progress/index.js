#!/usr/bin/env node

const cli = require('../../src/cli');
const http_get_stream_range = require('../../src/http_get_stream_range');
const stream = require('stream');
const stream_discard = require('../../src/stream_discard');
const stream_progress = require('../../src/stream_progress');

cli(main);

async function main()
{
    // const url = 'https://software.download.prss.microsoft.com/dbazure/Win10_22H2_English_x64v1.iso?t=4bc6bf41-d6d8-4439-abd6-a6abae233f12&e=1707058894&h=6b7b041774d41dd6b7836069728776592b1347b39aabc0f7a00c361d59769cc3';
    const url = 'https://releases.ubuntu.com/22.04.4/ubuntu-22.04.4-desktop-amd64.iso';

    const rs = await http_get_stream_range(url);
    await stream.promises.pipeline(
        rs,
        stream_progress({
            total: rs.content_range.total,
            user_friendly_status: s => console.log(`Downloading: ${s}`),
        }),
        stream_discard()
    );

    console.log('done');
}
