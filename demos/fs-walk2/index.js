#!/usr/bin/env node

const array_sum = require('@vbarbarosh/node-helpers/src/array_sum');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const fcmpx = require('@vbarbarosh/node-helpers/src/fcmpx');
const format_bytes = require('@vbarbarosh/node-helpers/src/format_bytes');
const format_thousands = require('@vbarbarosh/node-helpers/src/format_thousands');
const fs_walk = require('../../src/fs_walk');
const format_seconds = require('../../src/format_seconds');

cli(main);

async function main()
{
    const started = Date.now();
    const errors = [];

    const items = await fs_walk({
        path: '/usr/share',
        user_friendly_status: user_friendly_status,
        error_handler: e => errors.push(e),
    });

    console.log();
    console.log(`Total errors: ${format_thousands(errors.length)}`);
    console.log(`Total files: ${format_thousands(items.filter(v => v.isFile()).length)}`);
    console.log(`Total directories: ${format_thousands(items.filter(v => v.isDirectory()).length)}`);
    console.log(`Total bytes: ${format_bytes(array_sum(items.map(v => v.size)))}`);
    console.log(`Total time: ${format_seconds((Date.now() - started)/1000)}`);
    console.log(`Total mem: ${mem_info()}`);
    console.log(items.sort(fcmpx('-size')).slice(0, 10).map(v => [format_bytes(v.size), v.path]));

    console.log('🎉 Done');
}

function user_friendly_status(s)
{
    console.log(s);
}

function mem_info()
{
    const m = process.memoryUsage();
    return format_bytes(m.rss);
}
