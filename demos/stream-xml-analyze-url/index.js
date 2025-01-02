#!/usr/bin/env node

const cli = require('../../src/cli');
const format_bytes = require('../../src/format_bytes');
const http_get_stream = require('../../src/http_get_stream');
const perf_end_human = require('../../src/perf_end_human');
const perf_start = require('../../src/perf_start');
const stream = require('stream');
const stream_gunzip = require('../../src/stream_gunzip');
const stream_progress = require('../../src/stream_progress');
const stream_xml_analyze = require('../../src/stream_xml_analyze');

cli(main);

async function main()
{
    const time0 = perf_start();

    // const input_url = 'https://dumps.wikimedia.org/enwiki/latest/enwiki-latest-pages-logging1.xml.gz';
    const input_url = 'https://aiweb.cs.washington.edu/research/projects/xmltk/xmldata/data/pir/psd7003.xml.gz';
    await user_friendly_status(`🌎 Connecting to ${input_url}`);
    const rs = await http_get_stream(input_url);
    const [out] = await stream.compose(
        rs,
        stream_progress({total: rs.total, user_friendly_status}),
        stream_gunzip(),
        stream_xml_analyze()
    ).toArray();

    console.log(out);
    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}

function user_friendly_status(s)
{
    console.log(s, `mem=${format_bytes(process.memoryUsage().heapUsed)}`);
}
