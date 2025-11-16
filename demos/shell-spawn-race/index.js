#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const shell_spawn = require('@vbarbarosh/node-helpers/src/shell_spawn');
const stream = require('stream');

cli(main);

async function main()
{
    const proc = shell_spawn([`${__dirname}/hello.js`]);
    console.log('Started');
    await Promise.delay(0);
    await proc.init(); // << Stuck!
    console.log('Ready');
    await Promise.delay(0);
    await proc.promise();
    console.log(await stream.Readable.from(proc.stdout).toArray());
    console.log('🎉 Done');
}
