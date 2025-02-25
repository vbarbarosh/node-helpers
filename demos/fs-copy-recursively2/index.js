#!/usr/bin/env node

const NotImplemented = require('../../src/errors/NotImplemented');
const cli = require('../../src/cli');
const fs = require('fs');
const fs_copy_excl = require('../../src/fs_copy_excl');
const fs_lstat = require('../../src/fs_lstat');
const fs_mkdir = require('../../src/fs_mkdir');
const fs_path_join = require('../../src/fs_path_join');
const fs_path_relative = require('../../src/fs_path_relative');
const fs_readdir = require('../../src/fs_readdir');
const fs_rmrf = require('../../src/fs_rmrf');
const parallel = require('../../src/parallel');

cli(main);

async function main()
{
    await fs_rmrf('out', (v,p) => console.log(v, p));

    const source_dir = '/usr/share';

    console.log('Reading source dir...');
    const items = await fs_lstat_down(source_dir);

    console.log('Copying...');
    await parallel2({
        concurrency: 1,
        items,
        fn: async function (lstat) {
            const output_file = fs_path_join('out', fs_path_relative(source_dir, lstat.path));
            if (lstat.isDirectory()) {
                console.log('mkdir', output_file);
                await fs_mkdir(output_file);
            }
            else if (lstat.isFile()) {
                console.log('cp', lstat.path, '->', output_file);
                await fs_copy_excl(lstat.path, output_file);
            }
            else if (lstat.isSymbolicLink()) {
                const target = await fs.promises.readlink(lstat.path)
                console.log('ln -s', output_file, '->', target);
                await fs.promises.symlink(target, output_file);
            }
            else {
                throw new NotImplemented();
            }
        },
    })
}

async function parallel2({items, concurrency, fn})
{
    let i = 0;
    await parallel({
        concurrency,
        spawn: function () {
            if (i >= items.length) {
                return null;
            }
            return fn(items[i++]);
        },
    });
}

async function fs_lstat_down(path = '.')
{
    const out = [];
    for (const queue = [path]; queue.length; ) {
        const p = queue.pop();
        const lstat = await fs_lstat(p);
        lstat.path = p;
        out.push(lstat);
        if (lstat.isDirectory()) {
            const names = await fs_readdir(p);
            queue.push(...names.map(v => fs_path_join(p, v)));
        }
    }
    out.sort((a,b) => a.path.localeCompare(b.path));
    return out;
}
