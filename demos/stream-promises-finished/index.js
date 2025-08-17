#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const stream = require('stream');
const stream_each = require('@vbarbarosh/node-helpers/src/stream_each');

cli(main);

async function main()
{
    const rs = stream.Readable.from([1,2,3,4,5]);
    await stream.promises.finished(rs.pipe(stream_each(v => console.log(v))));
    console.log('🎉 Done');
}
