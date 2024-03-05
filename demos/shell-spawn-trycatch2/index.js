#!/usr/bin/env node

const cli = require('../../src/cli');
const shell_spawn = require('../../src/shell_spawn');
const stream_strpbrk = require('../../src/stream_strpbrk');

cli(main);

async function main()
{
    try {
        const proc = await shell_spawn(['xfail']).init();
        for await (const line of proc.stdout.pipe(stream_strpbrk('\r\n'))) {
            console.log(line);
        }
        await proc.promise();
        console.log('done');
    }
    catch (error) {
        console.log('failed', error);
    }
}
