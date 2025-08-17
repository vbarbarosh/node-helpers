#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const fs_read_stream = require('@vbarbarosh/node-helpers/src/fs_read_stream');
const fs_size = require('@vbarbarosh/node-helpers/src/fs_size');
const fs_write_stream = require('@vbarbarosh/node-helpers/src/fs_write_stream');
const perf_end_human = require('@vbarbarosh/node-helpers/src/perf_end_human');
const perf_start = require('@vbarbarosh/node-helpers/src/perf_start');
const stream = require('stream');
const stream_progress = require('@vbarbarosh/node-helpers/src/stream_progress');

cli(main);

async function main()
{
    const time0 = perf_start();

    const file = '/tmp/ubuntu-24.04.1-desktop-amd64.iso';
    await stream.promises.pipeline(
        fs_read_stream(file),
        stream_progress({
            total: await fs_size(file),
            user_friendly_status: s => console.log(`Copying: ${s}`),
        }),
        fs_write_stream('a.iso'),
        {signal: AbortSignal.timeout(1000)},
    );

    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}
