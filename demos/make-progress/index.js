#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const format_percents = require('@vbarbarosh/node-helpers/src/format_percents');
const make_progress = require('@vbarbarosh/node-helpers/src/make_progress');

cli(main);

async function main()
{
    const p = make_progress(1000);
    for (let i = 0; i < 1000; ++i) {
        await Promise.delay(Math.random()*25);
        p.add(1);
        console.log(`${p.done} of ${p.total} ${format_percents(p.percents)} at ${p.rate.toFixed(2)}/s ETA ${p.eta.toFixed(2)}s duration=${p.duration.toFixed(2)}s`);
    }
}
