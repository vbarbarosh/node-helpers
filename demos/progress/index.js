#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../../src/cli');
const progress = require('../../src/progress');

cli(main);

async function main()
{
    const p = progress(1000);
    for (let i = 0; i < 1000; ++i) {
        await Promise.delay(Math.random()*25);
        p.add(1);
        console.log(`${p.done} of ${p.total} ${(p.percentage*100).toFixed(2)}% rate=${p.rate.toFixed(0)}/s eta=${p.eta.toFixed(2)}s duration=${p.duration.toFixed(2)}s`);
    }
}
