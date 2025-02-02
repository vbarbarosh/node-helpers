#!/usr/bin/env node

const cli = require('../../src/cli');
const fs = require('fs');
const fs_path_resolve = require('../../src/fs_path_resolve');
const stream = require('stream');
const stream_strpbrk = require('../../src/stream_strpbrk');

cli(main);

async function main()
{
    // ☢️ AbortError: The operation was aborted
    //
    // node 22.11.0
    // Seems that async generator inside stream.compose -> stream.compose is a cause to this AbortError.

    const items = await stream.compose(
        fs.createReadStream(fs_path_resolve(__dirname, 'ffmpeg-progress')),
        stream.compose(
            stream_strpbrk('\r\n'),
            async function* (lines) {
                let out = {};
                for await (const line of lines) {
                    const [, key, value] = line.match(/([^=]+)=\s*(.*)/);
                    out[key] = value;
                    if (key === 'progress') {
                        yield out;
                        out = {};
                    }
                }
                yield out;
            },
        )
    ).toArray();

    console.log(items);
}
