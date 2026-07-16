const assert = require('assert');
const stream = require('stream');
const stream_progress = require('./stream_progress');

describe('stream_progress', function () {
    it('should pass bytes through unchanged and report 100% at the end', async function () {
        const statuses = [];
        const input = [Buffer.from('aaa'), Buffer.from('bbb')];
        const progress = stream_progress({interval: 60000, total: 6, user_friendly_status: s => statuses.push(s)});
        const out = Buffer.concat(await stream.Readable.from(input).pipe(progress).toArray());
        assert.strictEqual(out.toString('utf8'), 'aaabbb');
        assert.ok(statuses.length >= 1, 'no status messages emitted');
        assert.match(statuses[statuses.length - 1], /100%/);
    });
    it('should count items in objectMode', async function () {
        const statuses = [];
        const progress = stream_progress({objectMode: true, interval: 60000, total: 3, user_friendly_status: s => statuses.push(s)});
        const out = await stream.Readable.from([{a: 1}, {b: 2}, {c: 3}]).pipe(progress).toArray();
        assert.deepStrictEqual(out, [{a: 1}, {b: 2}, {c: 3}]);
        assert.match(statuses[statuses.length - 1], /100%/);
    });
    it('should emit the first message before any data arrives', async function () {
        const statuses = [];
        const progress = stream_progress({interval: 60000, total: 6, user_friendly_status: s => statuses.push(s)});
        await new Promise(resolve => setTimeout(resolve, 10));
        assert.ok(statuses.length >= 1, 'no early status message');
        progress.destroy();
    });
});
