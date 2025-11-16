#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');

cli(main);

async function main()
{
    try {
        await Promise.delay(1000).timeout(100);
    }
    catch (error) {
        console.log(error);
    }
}
