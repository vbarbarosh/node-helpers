import assert from 'assert';
import fs from 'fs';
import stream_data_ln from './stream_data_ln';
import stream_promise from './stream_promise';

describe('stream_data_ln', function () {
    it('should handle basic input', async function () {
        let tmp = '';
        const s = fs.createReadStream(__filename);
        const off = stream_data_ln(s, v => tmp += v + '\n');
        await stream_promise(s);
        off();
        assert.deepStrictEqual(tmp, fs.readFileSync(__filename, {encoding: 'utf8'}));
    });
});
