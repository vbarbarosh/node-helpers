#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const fastdl = require('@vbarbarosh/node-helpers/src/fastdl');
const fs_path_basename = require('@vbarbarosh/node-helpers/src/fs_path_basename');
const sftp_get_stream_range = require('@vbarbarosh/node-helpers/src/sftp_get_stream_range');

cli(main);

async function main()
{
    const url = 'sftp://username:password@domain.com/path/to/file/a.zip';
    await fastdl({
        file: fs_path_basename(new URL(url).pathname),
        read_stream_with_range: (first, last) => sftp_get_stream_range(url, first, last),
        concurrency: 200,
        user_friendly_status: s => console.log(`[fastdl] ${s}`),
    });
    console.log('done');
}
