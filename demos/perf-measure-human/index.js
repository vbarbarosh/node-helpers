#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../../src/cli');
const perf_measure_human = require('../../src/perf_measure_human');

cli(main);

async function main()
{
    console.log(`🎉 Finished in ${await perf_measure_human(() => Promise.delay(100))}`);
}
