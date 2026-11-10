const UserFriendlyError = require('./errors/UserFriendlyError');
const assert = require('assert');
const fastdl = require('./fastdl');
const fs_path_resolve = require('./fs_path_resolve');
const fs_read_buffer = require('./fs_read_buffer');
const fs_read_utf8 = require('./fs_read_utf8');
const fs_readdir = require('./fs_readdir');
const fs_tempdir = require('./fs_tempdir');
const fs_write = require('./fs_write');
const ignore = require('./ignore');
const sftp_get_stream_range = require('./sftp_get_stream_range');
const sftp_server_listen = require('./sftp_get_stream_range.d/sftp_server');
const stream = require('stream');
const wait_while = require('./wait_while');

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
                user_friendly_status: ignore,
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
                user_friendly_status: ignore,
            }), /download failed/);

            assert.strictEqual(await fs_read_utf8(file), 'ORIGINAL');
            assert.deepStrictEqual(await fs_readdir(d), ['out.bin']);
        });
    });
    it('should reject with a UserFriendlyError and leave no timer when the server ignores Range', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'out.bin');
            const timers_before = count_timers();
            let rs0 = null;

            await assert.rejects(fastdl({
                concurrency: 2,
                file,
                read_stream_with_range: async function () {
                    rs0 = stream.Readable.from([content]);
                    rs0.content_range = {first: 0, last: null, total: null, type: 'bytes'};
                    return rs0;
                },
                user_friendly_status: ignore,
            }), function (error) {
                assert(error instanceof UserFriendlyError);
                assert.match(error.message, /did not return the resource size/);
                return true;
            });

            assert.strictEqual(rs0.destroyed, true);
            assert.strictEqual(count_timers(), timers_before);
            assert.deepStrictEqual(await fs_readdir(d), []);
        });
    });
    it('should finish an empty resource as an empty file and close its stream unread', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_resolve(d, 'out.bin');
            const timers_before = count_timers();
            const streams = [];

            await fastdl({
                concurrency: 2,
                file,
                read_stream_with_range: async function () {
                    // Never ends by itself, as a connection nobody reads
                    const rs = new stream.Readable({read: ignore});
                    rs.content_range = {first: null, last: null, total: 0, type: 'bytes'};
                    streams.push(rs);
                    return rs;
                },
                user_friendly_status: ignore,
            });

            assert.strictEqual(streams.length, 1);
            assert.strictEqual(streams[0].destroyed, true);
            assert.strictEqual(count_timers(), timers_before);
            assert.deepStrictEqual(await fs_read_buffer(file), Buffer.alloc(0));
            assert.deepStrictEqual(await fs_readdir(d), ['out.bin']);
        });
    });
    [0, 1, 780, 1024*1024, 1024*1024 + 1].forEach(function (size) {
        it(`should download a file of ${size} bytes over sftp whole and close every connection`, async function () {
            const body = Buffer.alloc(size);
            for (let i = 0; i < size; ++i) {
                body[i] = i % 251;
            }
            const server = await sftp_server_listen(body);
            try {
                await fs_tempdir(async function (d) {
                    const file = fs_path_resolve(d, 'out.bin');
                    let connections = 0;

                    await fastdl({
                        concurrency: 2,
                        file,
                        read_stream_with_range: function (first, last) {
                            connections++;
                            return sftp_get_stream_range(server.url('/data.bin'), first, last);
                        },
                        user_friendly_status: ignore,
                    });

                    assert(body.equals(await fs_read_buffer(file)));
                    assert.deepStrictEqual(await fs_readdir(d), ['out.bin']);
                    await wait_while(() => server.closed() !== connections);
                });
            }
            finally {
                await server.close();
            }
        });
    });
    [0, -1, NaN, Infinity, 1.5].forEach(function (concurrency) {
        it(`should reject invalid concurrency [${concurrency}] before creating a file`, async function () {
            await fs_tempdir(async function (d) {
                await assert.rejects(fastdl({
                    concurrency,
                    file: fs_path_resolve(d, 'out.bin'),
                    read_stream_with_range: make_reader(content),
                    user_friendly_status: ignore,
                }), /\[concurrency] should be a positive integer/);
                assert.deepStrictEqual(await fs_readdir(d), []);
            });
        });
    });
});

function count_timers()
{
    return process.getActiveResourcesInfo().filter(v => v === 'Timeout').length;
}

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
