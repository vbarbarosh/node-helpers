const cli = require('../../src/cli');
const stream = require('stream');
const stream_each = require('../../src/stream_each');
const stream_group = require('../../src/stream_group');
const stream_progress = require('../../src/stream_progress');

cli(main);

async function main()
{
    const items = [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5},
        {id: 6},
        {id: 7},
        {id: 8},
        {id: 9},
        {id: 10},
    ];
    await stream.promises.pipeline(
        stream.Readable.from(items),
        stream_progress({
            objectMode: true,
            total: items.length,
            user_friendly_status: v => console.log(`[status] ${v}`),
        }),
        stream_group(3),
        stream_each(function (item) {
            console.log('[stream_each]', item);
        }),
    );
    console.log('🎉 Done');
}
