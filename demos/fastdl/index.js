#!/usr/bin/env node

const cli = require('../../src/cli');
const fastdl = require('../../src/fastdl');
const fs_path_basename = require('../../src/fs_path_basename');
const http_get_stream_range = require('../../src/http_get_stream_range');

cli(main);

async function main()
{
    // a435f6f393dda581172490eda9f683c32e495158a780b5a1de422ee77d98e909 *ubuntu-22.04.3-desktop-amd64.iso
    // a6f470ca6d331eb353b815c043e327a347f594f37ff525f17764738fe812852e
    // const url = 'https://software.download.prss.microsoft.com/dbazure/Win10_22H2_English_x64v1.iso?t=4bc6bf41-d6d8-4439-abd6-a6abae233f12&e=1707058894&h=6b7b041774d41dd6b7836069728776592b1347b39aabc0f7a00c361d59769cc3';

    // https://github.com/vbarbarosh/dev-proxy
    const url = 'http://127.0.0.1:3000/proxy?url=https://mirror.ihost.md/ubuntu-releases/22.04.3/ubuntu-22.04.3-desktop-amd64.iso&throttle=256k';

    await fastdl({
        file: 'ubuntu-22.04.3-desktop-amd64.iso',
        concurrency: 10,
        read_stream_with_range: (first, last) => http_get_stream_range(url, first, last),
        user_friendly_status: s => console.log(`[fastdl] ${s}`),
    });
    console.log('done');
}
