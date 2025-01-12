#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../../src/cli');
const countdown = require('../../src/countdown');
const format_ms = require('../../src/format_ms');
const format_ms3 = require('../../src/format_ms3');
const perf_end_human = require('../../src/perf_end_human');
const perf_start = require('../../src/perf_start');

cli(main);

async function main()
{
    const time0 = perf_start();

    await countdown({
        value: Promise.delay(3000),
        timeout: 5000,
        tick_ms: 500,
        tick: function (ctx) {
            console.log(`[${format_ms3(ctx.time_elapsed)}][tick] remain=${format_ms(ctx.time_remained)}`);
        },
    });

    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}
