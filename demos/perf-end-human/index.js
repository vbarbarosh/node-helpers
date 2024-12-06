#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../../src/cli');
const perf_end_human = require('../../src/perf_end_human');
const perf_start = require('../../src/perf_start');

cli(main);

async function main()
{
    const time0 = perf_start();

    await Promise.delay(100);

    console.log(`🎉 Finished in ${perf_end_human(time0)}`);
}
