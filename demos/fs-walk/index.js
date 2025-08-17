#!/usr/bin/env node

const array_sum = require('@vbarbarosh/node-helpers/src/array_sum');
const cli = require('@vbarbarosh/node-helpers/src/cli');
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
            items.push(lstat);
            if (lstat.isDirectory()) {
                const basenames = await fs_readdir(path);
                basenames.forEach(v => pending.push(fs_path_join(path, v)));
            }
            delta++;
            if (Date.now() - last_progress > 1000) {
                p.add(delta);
                delta = 0;
                last_progress = Date.now();
                console.log(format_progress_kilo(p));
            }
        }
        catch (error) {
            console.log(`⚠️ ${error.message}`);
            errors.push(error);
        }
    }

    p.add(delta);
    console.log(format_progress_kilo(p));

    console.log();
    console.log(`Total errors: ${format_thousands(errors.length)}`);
    console.log(`Total files: ${format_thousands(items.filter(v => v.isFile()).length)}`);
    console.log(`Total directories: ${format_thousands(items.filter(v => v.isDirectory()).length)}`);
    console.log(`Total bytes: ${format_bytes(array_sum(items.map(v => v.size)))}`);
    console.log();

    console.log('🎉 Done');
}
