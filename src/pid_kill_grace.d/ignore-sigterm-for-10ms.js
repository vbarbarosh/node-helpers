#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const now_human = require('@vbarbarosh/node-helpers/src/now_human');

// Child ignores SIGTERM for 10 ms, but dies naturally before the grace loop ends

cli(main);

async function main()
{
    let timer;

    process.on('SIGTERM', function () {
        console.log(`[${now_human()}][ignore-sigterm-for-10ms] SIGTERM_ignoring...`);
        timer ??= setTimeout(terminate, 10);
    });
    process.on('SIGINT', function () {
        console.log(`[${now_human()}][ignore-sigterm-for-10ms] SIGINT_ignoring...`);
    });

    for (let iter = 1, last = 100; iter <= last; ++iter) {
        console.log(`[${now_human()}][ignore-sigterm-for-10ms] ${iter} of ${last}`);
        await Promise.delay(10);
    }
}

function terminate()
{
    console.log(`[${now_human()}][ignore-sigterm-for-10ms] TERMINATE_AFTER_10MS`);
    process.exit(0);
}
