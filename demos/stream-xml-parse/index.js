#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const format_bytes = require('@vbarbarosh/node-helpers/src/format_bytes');
const fs = require('fs');
const fs_size = require('@vbarbarosh/node-helpers/src/fs_size');
const stream = require('stream');
const stream_map = require('@vbarbarosh/node-helpers/src/stream_map');
const stream_progress = require('@vbarbarosh/node-helpers/src/stream_progress');
const stream_xml_parse = require('@vbarbarosh/node-helpers/src/stream_xml_parse');

cli(main);

async function main()
{
    const input_file = '/tmp/psd7003.xml';
    await stream.promises.pipeline(
        fs.createReadStream(input_file),
        stream_progress({total: await fs_size(input_file), user_friendly_status}),
        stream_xml_parse(['ProteinDatabase', 'ProteinEntry']),
        stream_map(v => `${JSON.stringify(v)}\n`),
        fs.createWriteStream('out.ndjson')
    );
}

function user_friendly_status(s)
{
    console.log(s, `mem=${format_bytes(process.memoryUsage().heapUsed)}`);
}
