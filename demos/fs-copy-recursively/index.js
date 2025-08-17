#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const countdown = require('@vbarbarosh/node-helpers/src/countdown');
const format_bytes = require('@vbarbarosh/node-helpers/src/format_bytes');
const format_progress_bytes = require('@vbarbarosh/node-helpers/src/format_progress_bytes');
const format_progress_kilo = require('@vbarbarosh/node-helpers/src/format_progress_kilo');
const format_thousands = require('@vbarbarosh/node-helpers/src/format_thousands');
const fs = require('node:fs');
const fs_lstat = require('@vbarbarosh/node-helpers/src/fs_lstat');
const fs_mkdir = require('@vbarbarosh/node-helpers/src/fs_mkdir');
const fs_path_join = require('@vbarbarosh/node-helpers/src/fs_path_join');
const fs_read_stream = require('@vbarbarosh/node-helpers/src/fs_read_stream');
const fs_readdir = require('@vbarbarosh/node-helpers/src/fs_readdir');
const fs_rmrf = require('@vbarbarosh/node-helpers/src/fs_rmrf');
const fs_write_stream = require('@vbarbarosh/node-helpers/src/fs_write_stream');
const make_progress = require('@vbarbarosh/node-helpers/src/make_progress');
const msval = require('@vbarbarosh/node-helpers/src/msval');
const perf_end_human = require('@vbarbarosh/node-helpers/src/perf_end_human');
const perf_start = require('@vbarbarosh/node-helpers/src/perf_start');
const stream = require('stream');

cli(main);

async function main()
{
    const time0 = perf_start();
    const path = '/usr/share';

    const ac = new AbortController();
    setTimeout(() => ac.abort(), 1500);

    const files = await fs_walk({
        path: '/usr/share',
        user_friendly_status: s => console.log(`Reading files: ${s}`),
        signal: ac.signal,
    });

    console.log();
    console.log('Total files:', format_thousands(files.length));
    console.log('Total bytes:', format_bytes(files.reduce((a,v) => a + v.lstat.size, 0)));
    console.log();

    await fs_rmrf('/tmp/a');
    await fs_copy_recursively({
        files,
        base: path,
        dest: '/tmp/a',
        user_friendly_status: s => console.log(`Copying files: ${s}`),
        signal: ac.signal,
    });

    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}

async function fs_walk({path, user_friendly_status, signal})
{
    const base = path;
    const out = [];
    const p = make_progress();
    const pending = [path];
    let delta = 0;
    let last_progress = 0;
    while (pending.length) {
        if (signal) {
            signal.throwIfAborted();
        }
        const path = pending.pop();
        const lstat = await fs_lstat(path);
        out.push({base, path, lstat});
        if (lstat.isDirectory()) {
            const basenames = await fs_readdir(path);
            basenames.forEach(v => pending.push(fs_path_join(path, v)));
        }
        delta++;
        if (Date.now() - last_progress > 1000) {
            p.add(delta);
            delta = 0;
            last_progress = Date.now();
            user_friendly_status(format_progress_kilo(p));
        }
    }
    p.add(delta);
    user_friendly_status(format_progress_kilo(p));
    return out;
}

async function fs_copy_recursively({files, dest, user_friendly_status, signal})
{
    let delta = 0;
    const p = make_progress(files.reduce((a,v) => a + v.lstat.size, 0));
    await countdown({
        signal,
        timeout: msval(0, 5, 0, 0),
        tick_ms: 100,
        tick: function () {
            p.add(delta);
            delta = 0;
            user_friendly_status(format_progress_bytes(p));
        },
        fn: async function () {
            for (let i = 0; i < files.length; ++i) {
                if (signal) {
                    signal.throwIfAborted();
                }
                const file = files[i];
                const path_base = file.path.slice(file.base.length + 1);
                const path_in = file.path;
                const path_out = fs_path_join(dest, path_base);
                // file.lstat.isBlockDevice()
                // file.lstat.isCharacterDevice()
                // file.lstat.isDirectory()
                // file.lstat.isFIFO()
                // file.lstat.isFile()
                // file.lstat.isSocket()
                // file.lstat.isSymbolicLink()
                if (file.lstat.isFile()) {
                    await stream.promises.pipeline(
                        fs_read_stream(path_in),
                        stream_tap2(buf => delta += buf.length),
                        fs_write_stream(path_out, {flags: 'wx'}),
                        {signal},
                    );
                    continue;
                }
                if (file.lstat.isDirectory()) {
                    await fs_mkdir(path_out);
                    delta += file.lstat.size;
                    continue;
                }
                if (file.lstat.isSymbolicLink()) {
                    await fs.promises.symlink(await fs.promises.readlink(path_in), path_out);
                    delta += file.lstat.size;
                    continue;
                }
                throw new Error(`Invalid file type: ${path_in}`);
            }
        },
    });
    p.add(delta);
    delta = 0;
    user_friendly_status(format_progress_bytes(p));
}

function stream_tap2(fn)
{
    return new stream.Transform({
        transform: async function (item, encoding, callback) {
            try {
                await fn(item);
                this.push(item, encoding);
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
}
