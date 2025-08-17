#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const shell_spawn = require('@vbarbarosh/node-helpers/src/shell_spawn');

cli(main);

async function main()
{
    try {
        await shell_spawn(['xfail']).promise();
        console.log('done');
    }
    catch (error) {
        console.log('failed', error);
    }
}
