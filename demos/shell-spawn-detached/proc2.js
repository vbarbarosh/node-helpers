#!/usr/bin/env node

const cli = require('../../src/cli');
const perf_end_human = require('../../src/perf_end_human');
const perf_start = require('../../src/perf_start');
const Promise = require('bluebird');
const fs_append = require('../../src/fs_append');
const format_date = require('../../src/format_date');

cli(main);

async function main()
{
    const time0 = perf_start();

    for (let i = 0; i < 10; ++i) {
        await fs_append('logs.txt', `[${format_date(new Date())}] ${i}\n`);
        await Promise.delay(1000);
    }

    await fs_append('logs.txt', `[${format_date(new Date())}] 🎉 Done in ${perf_end_human(time0)}\n`);
    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}
