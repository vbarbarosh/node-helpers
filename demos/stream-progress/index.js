#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../../src/cli');
const stream = require('stream');
const stream_discard = require('../../src/stream_discard');
const stream_progress = require('../../src/stream_progress');

cli(main);

async function main()
{
    const total = 1E7;
    const rs = stream.Readable.from(gen(total));
    await stream.promises.pipeline(
        rs,
        stream_progress({total, interval: 100}),
        stream_discard()
    );
    console.log('🎉 Done');
}

async function* gen(total)
{
    for (let i = 0; i < total; ++i) {
        yield Buffer.from([i]);
        if (i % 1E3 === 0) {
            await Promise.delay(0);
        }
    }
}
