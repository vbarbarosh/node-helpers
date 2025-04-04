#!/usr/bin/env node

const cli = require('../../src/cli');
const format_bytes = require('../../src/format_bytes');
const fs = require('fs');
const fs_size = require('../../src/fs_size');
const stream = require('stream');
const stream_progress = require('../../src/stream_progress');
const stream_xml_analyze = require('../../src/stream_xml_analyze');
const perf_end_human = require('../../src/perf_end_human');
const perf_start = require('../../src/perf_start');

cli(main);

async function main()
{
    const time0 = perf_start();

    // const input_url = '/tmp/enwiki-latest-pages-logging1.xml';
    const input_file = '/tmp/psd7003.xml';

    const [out] = await stream.compose(
        fs.createReadStream(input_file),
        stream_progress({total: await fs_size(input_file), user_friendly_status}),
        stream_xml_analyze()
    ).toArray();

    console.log(out);
    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}

function user_friendly_status(s)
{
    console.log(s, `mem=${format_bytes(process.memoryUsage().heapUsed)}`);
}
