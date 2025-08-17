#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const format_hrtime = require('@vbarbarosh/node-helpers/src/format_hrtime');

cli(main);

async function main()
{
    const hrtime0 = process.hrtime();

    await Promise.delay(100);

    console.log(`Finished in ${format_hrtime(process.hrtime(hrtime0))}`);
}
