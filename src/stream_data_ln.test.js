const assert = require('assert');
const fs = require('fs');
const split = require('split');
const stream = require('stream');
const stream_data_ln = require('./stream_data_ln');
const stream_promise = require('./stream_promise');

describe('stream_data_ln', function () {
    it('should handle basic input', async function () {
        let actual = '';
        const s = fs.createReadStream(__filename);
        const off = stream_data_ln(s, v => actual += v + '\n');
        await stream_promise(s);
        off();
        assert.deepStrictEqual(actual, fs.readFileSync(__filename, {encoding: 'utf8'}));
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
