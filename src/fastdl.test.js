const assert = require('assert');
const fastdl = require('./fastdl');
const fs_path_resolve = require('./fs_path_resolve');
const fs_read_buffer = require('./fs_read_buffer');
const fs_read_utf8 = require('./fs_read_utf8');
const fs_readdir = require('./fs_readdir');
const fs_tempdir = require('./fs_tempdir');
const fs_write = require('./fs_write');
const stream = require('stream');

describe('fastdl', function () {
    const content = Buffer.alloc(3*1024*1024, 'x');

    it('should atomically replace an existing destination after a complete download', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'out.bin');
            await fs_write(file, 'ORIGINAL');

            await fastdl({
                concurrency: 2,
                file,
                read_stream_with_range: make_reader(content),
                user_friendly_status: function () {},
            });

            assert(content.equals(await fs_read_buffer(file)));
            assert.deepStrictEqual(await fs_readdir(d), ['out.bin']);
        });
    });
    it('should preserve an existing destination and remove temporary files on failure', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'out.bin');
            await fs_write(file, 'ORIGINAL');

            await assert.rejects(fastdl({
                concurrency: 2,
                file,
                read_stream_with_range: async function () {
                    throw new Error('download failed');
                },
                user_friendly_status: function () {},
            }), /download failed/);

            assert.strictEqual(await fs_read_utf8(file), 'ORIGINAL');
            assert.deepStrictEqual(await fs_readdir(d), ['out.bin']);
        });
    });
});

function make_reader(content)
{
    return async function (first, last) {
        const actual_last = Math.min(last, content.length - 1);
        const out = stream.Readable.from([content.subarray(first, actual_last + 1)]);
        out.content_range = {
            first,
            last: actual_last,
            total: content.length,
            type: 'bytes',
        };
        return out;
    };
}
