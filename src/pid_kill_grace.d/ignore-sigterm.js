#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../cli');
const now_human = require('../now_human');

cli(main);

async function main()
{
    process.on('SIGTERM', function () {
        console.log(`[${now_human()}][ignore-sigterm] SIGTERM_ignoring...`);
    });
    process.on('SIGINT', function () {
        console.log(`[${now_human()}][ignore-sigterm] SIGINT_ignoring...`);
    });

    for (let iter = 1, last = 100; iter <= last; ++iter) {
        console.log(`[${now_human()}][ignore-sigterm] ${iter} of ${last}`);
        await Promise.delay(10);
    }
}
