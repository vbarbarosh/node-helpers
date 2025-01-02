#!/usr/bin/env node

const cli = require('../../src/cli');
const format_bytes = require('../../src/format_bytes');
const fs = require('fs');
const fs_size = require('../../src/fs_size');
const stream = require('stream');
const stream_map = require('../../src/stream_map');
const stream_progress = require('../../src/stream_progress');
const stream_xml_parse = require('../../src/stream_xml_parse');

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
