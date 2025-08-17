#!/usr/bin/env node

const array_sum = require('@vbarbarosh/node-helpers/src/array_sum');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const fcmpx = require('@vbarbarosh/node-helpers/src/fcmpx');
const format_bytes = require('@vbarbarosh/node-helpers/src/format_bytes');
const format_progress_kilo = require('@vbarbarosh/node-helpers/src/format_progress_kilo');
const format_thousands = require('@vbarbarosh/node-helpers/src/format_thousands');
const fs_lstat = require('@vbarbarosh/node-helpers/src/fs_lstat');
const fs_path_join = require('@vbarbarosh/node-helpers/src/fs_path_join');
const fs_readdir = require('@vbarbarosh/node-helpers/src/fs_readdir');
const make_progress = require('@vbarbarosh/node-helpers/src/make_progress');

cli(main);

async function main()
{
    let delta = 0;
    let last_progress = 0;

    const p = make_progress();
    const pending = ['/usr/share'];
    const items = [];
    const errors = [];
    while (pending.length) {
        try {
            const path = pending.pop();
            const lstat = await fs_lstat(path);
            lstat.path = path;
            items.push(lstat);
            if (lstat.isDirectory()) {
                if (path === '/dev' || path === '/proc') {
                    continue;
                }
                const basenames = await fs_readdir(path);
                basenames.forEach(v => pending.push(fs_path_join(path, v)));
            }
            delta++;
            if (Date.now() - last_progress > 1000) {
                p.add(delta);
                delta = 0;
                last_progress = Date.now();
                console.log(format_progress_kilo(p), mem_info());
            }
        }
        catch (error) {
            console.log(`⚠️ ${error.message}`);
            errors.push(error);
        }
    }

    p.add(delta);
    console.log(format_progress_kilo(p), mem_info());

    // 14.83M of ~ at 49.58K/s duration=00:05:18 7.75GB
    // 14.86M of ~ at 35.44K/s duration=00:05:22 7.83GB
    // 14.89M of ~ at 34.12K/s duration=00:05:23 7.86GB
    // 14.94M of ~ at 34.73K/s duration=00:05:24 7.85GB
    // 14.94M of ~ at 34.74K/s duration=00:05:24
    //
    // Total errors: 2
    // Total files: 12,569,653
    // Total directories: 2,049,624
    // Total bytes: 709.59GB

    console.log();
    console.log(`Total errors: ${format_thousands(errors.length)}`);
    console.log(`Total files: ${format_thousands(items.filter(v => v.isFile()).length)}`);
    console.log(`Total directories: ${format_thousands(items.filter(v => v.isDirectory()).length)}`);
    console.log(`Total bytes: ${format_bytes(array_sum(items.map(v => v.size)))}`);
    console.log();
    console.log(items.sort(fcmpx('-size')).slice(0, 10).map(v => [format_bytes(v.size), v.path]));

    console.log('🎉 Done');
}

function mem_info()
{
    const m = process.memoryUsage();
    return format_bytes(m.rss);
}