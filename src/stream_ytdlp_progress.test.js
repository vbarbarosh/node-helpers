const assert = require('assert');
const stream = require('stream');
const stream_ytdlp_progress = require('./stream_ytdlp_progress');

// `last` is mutated in place by the helper, so copy each emitted row
async function read_rows(lines)
{
    return stream.Readable.from([lines.join('\n') + '\n']).pipe(stream_ytdlp_progress()).map(v => ({...v})).toArray();
}

describe('stream_ytdlp_progress', function () {
    it('should parse a download progress line', async function () {
        const rows = await read_rows(['[download]  50.9% of   15.71MiB at   33.83MiB/s ETA 00:01']);
        assert.deepStrictEqual(rows, [{
            current_part: 1,
            total_parts: 0,
            perc: '50.90%',
            done: '8.0MB',
            total: '15.71MB',
            speed: '33.83MB/s',
            eta: '00:01',
            merging: false,
        }]);
    });
    it('should report unknown speed and eta as ~', async function () {
        const rows = await read_rows(['[download]   0.0% of   15.71MiB at  Unknown B/s ETA Unknown']);
        assert.strictEqual(rows[0].speed, '~');
        assert.strictEqual(rows[0].eta, '~');
    });
    it('should ignore lines which are not progress reports', async function () {
        const rows = await read_rows(['Deleting original file xxx.f251.webm (pass -k to keep)', 'random noise']);
        assert.deepStrictEqual(rows, []);
    });
    it('should track parts of a multi-format download', async function () {
        const rows = await read_rows([
            '[info] abc123: Downloading 2 format(s): 251+248',
            '[download] Destination: video.f251.webm',
            '[download]  10.0% of   15.71MiB at   33.83MiB/s ETA 00:01',
            '[download] Destination: video.f248.webm',
            '[download]  20.0% of    4.00MiB at   33.83MiB/s ETA 00:01',
        ]);
        assert.strictEqual(rows.length, 2);
        assert.strictEqual(rows[0].current_part, 1);
        assert.strictEqual(rows[0].total_parts, 2);
        assert.strictEqual(rows[1].current_part, 2);
        assert.strictEqual(rows[1].total_parts, 2);
    });
    it('should flag the merging stage', async function () {
        // The helper mutates its `last` row in place, so only the final
        // state of the rows is asserted — not the merging flag per row
        const rows = await read_rows([
            '[download] 100.0% of   15.71MiB at   47.64MiB/s ETA 00:00',
            '[Merger] Merging formats into "video.webm"',
        ]);
        assert.strictEqual(rows.length, 2);
        assert.strictEqual(rows[1].merging, true);
        assert.strictEqual(rows[1].perc, '100%');
    });
});
