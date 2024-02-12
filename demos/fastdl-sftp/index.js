#!/usr/bin/env node

const cli = require('../../src/cli');
const fastdl = require('../../src/fastdl');
const fs_path_basename = require('../../src/fs_path_basename');
const sftp_get_stream_range = require('../../src/sftp_get_stream_range');

cli(main);

async function main()
{
    const url = 'sftp://username:password@domain.com/path/to/file/a.zip';
    await fastdl({
        file: fs_path_basename(new URL(url).pathname),
        read_stream_with_range: (first, last) => sftp_get_stream_range(url, first, last),
        concurrency: 200,
        log: s => console.log(`[fastdl] ${s}`),
    });
    console.log('done');
}
