#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const shell_spawn = require('@vbarbarosh/node-helpers/src/shell_spawn');
const stream_strpbrk = require('@vbarbarosh/node-helpers/src/stream_strpbrk');

cli(main);

async function main()
{
    const proc = await shell_spawn(['7z', 'x', '-aoa', '-bsp1', '/path/to/file.zip']).init();
    const lines = [];
    try {
        for await (const line of proc.stdout.pipe(stream_strpbrk('\r\n\x08'))) {
            lines.push(line);
            const m = line.match(/^\s*(\d+%.*)\s*$/);
            if (m) {
                console.log(`Extracting: ${m[1]}`);
            }
        }
        await proc.promise();
        console.log('done');
    }
    catch (error) {
        console.log('FAILED');
        console.log(`${error.message}\n\n${lines.join('\n')}`);
    }
}
