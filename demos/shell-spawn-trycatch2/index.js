#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const shell_spawn = require('@vbarbarosh/node-helpers/src/shell_spawn');
const stream_strpbrk = require('@vbarbarosh/node-helpers/src/stream_strpbrk');

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
