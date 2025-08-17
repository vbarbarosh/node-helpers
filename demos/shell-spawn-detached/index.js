#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const perf_end_human = require('@vbarbarosh/node-helpers/src/perf_end_human');
const perf_start = require('@vbarbarosh/node-helpers/src/perf_start');
const shell_spawn = require('@vbarbarosh/node-helpers/src/shell_spawn');

cli(main);

async function main()
{
    const time0 = perf_start();

    const proc = shell_spawn(['node', 'proc2.js'], {cwd: __dirname, stdio: 'ignore', detached: true});
    proc.unref();

    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}
