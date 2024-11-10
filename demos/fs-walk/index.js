#!/usr/bin/env node

const cli = require('../../src/cli');
const format_progress_kilo = require('../../src/format_progress_kilo');
const fs_lstat = require('../../src/fs_lstat');
const fs_path_join = require('../../src/fs_path_join');
const fs_readdir = require('../../src/fs_readdir');
const make_progress = require('../../src/make_progress');

cli(main);

async function main()
{
    let delta = 0;
    let last_progress = 0;

    const p = make_progress();
    const pending = ['/usr/share'];
    while (pending.length) {
        const path = pending.pop();
        const lstat = await fs_lstat(path);
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

    p.add(delta);
    console.log(format_progress_kilo(p));
    console.log('🎉 Done');
}
