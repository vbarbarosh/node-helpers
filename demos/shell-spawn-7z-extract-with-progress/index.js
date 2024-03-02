#!/usr/bin/env node

const cli = require('../../src/cli');
const shell_spawn = require('../../src/shell_spawn');
const stream_strpbrk = require('../../src/stream_strpbrk');

cli(main);

async function main()
{
    const proc = shell_spawn(['7z', 'x', '-aoa', '-bsp1', '/path/to/file.zip']);
    for await (const line of proc.stdout.pipe(stream_strpbrk('\r\n\x08'))) {
        const m = line.match(/^\s*(\d+%.*)\s*$/);
        if (m) {
            console.log(`Extracting: ${m[1]}`);
        }
    }
    await proc.promise();
    console.log('done');
}
