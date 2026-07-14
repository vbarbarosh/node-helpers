const assert = require('assert');
const fs = require('fs');
const split = require('split');
const stream = require('stream');
const stream_data_ln = require('./stream_data_ln');

describe('stream_data_ln', function () {
    it('should handle basic input', async function () {
        let actual = '';
        const s = fs.createReadStream(__filename);
        const off = stream_data_ln(s, v => actual += v + '\n');
        await stream.promises.finished(s);
        off();
        assert.deepStrictEqual(actual, fs.readFileSync(__filename, {encoding: 'utf8'}));
    });
    it('should not corrupt multi-byte utf8 split across chunks', async function () {
        const lines = [];
        const s = new stream.PassThrough();
        stream_data_ln(s, v => lines.push(v));
        const buf = Buffer.from('héllo\nwörld\n');
        for (let i = 0; i < buf.length; ++i) {
            s.write(buf.subarray(i, i + 1)); // 1-byte chunks: the worst case
        }
        s.end();
        await stream.promises.finished(s);
        assert.deepStrictEqual(lines, ['héllo', 'wörld']);
    });
    it('split', async function () {
        let actual = '';
        const s = fs.createReadStream(__filename);
        const ss = s.pipe(split('\n', null, {trailing: false}));
        ss.on('data', v => actual += v + '\n');
        await stream.promises.finished(ss);
        assert.deepStrictEqual(actual, fs.readFileSync(__filename, {encoding: 'utf8'}));
    });
});
