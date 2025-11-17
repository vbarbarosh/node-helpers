#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const now_human = require('@vbarbarosh/node-helpers/src/now_human');

cli(main);

async function main()
{
    for (let iter = 1, last = 100; iter <= last; ++iter) {
        console.log(`[${now_human()}][never-ping] ${iter} of ${last}`);
        await Promise.delay(100);
    }
}
