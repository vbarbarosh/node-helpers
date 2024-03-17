const cli = require('../../src/cli');
const fs = require('fs');
const fs_size = require('../../src/fs_size');
const stream = require('stream');
const stream_parse_xml = require('../../src/stream_parse_xml');
const stream_progress = require('../../src/stream_progress');
const stream_transform = require('../../src/stream_transform');

cli(main);

async function main()
{
    const input_file = 'enwiki-20240301-pages-articles-multistream1.xml';
    await stream.promises.pipeline(
        fs.createReadStream(input_file),
        stream_progress({total: await fs_size(input_file), user_friendly_status}),
        stream_parse_xml(['mediawiki', 'page']),
        stream_transform(v => `${JSON.stringify(v)}\n`),
        fs.createWriteStream('out.jsons')
    );
}

function user_friendly_status(s)
{
    console.log(s);
}
