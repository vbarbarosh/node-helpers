const assert = require('assert');
const stream = require('stream');
const stream_each = require('./stream_each');
const stream_xml_parse = require('./stream_xml_parse');

describe('stream_xml_parse', function () {
    it('should parse selected elements', async function () {
        const out = [];
        const xml = '<root><item><name>a</name></item><item><name>b</name></item></root>';
        await stream.promises.pipeline(
            stream.Readable.from([Buffer.from(xml)]),
            stream_xml_parse(['root', 'item']),
            stream_each(v => out.push(v)),
        );
        assert.deepStrictEqual(out, [{name: 'a'}, {name: 'b'}]);
    });
    it('should not corrupt multi-byte utf8 split across chunks', async function () {
        const out = [];
        const xml = Buffer.from('<root><item><name>héllo wörld</name></item></root>');
        const chunks = [];
        for (let i = 0; i < xml.length; ++i) {
            chunks.push(xml.subarray(i, i + 1)); // 1-byte chunks: the worst case
        }
        await stream.promises.pipeline(
            stream.Readable.from(chunks),
            stream_xml_parse(['root', 'item']),
            stream_each(v => out.push(v)),
        );
        assert.deepStrictEqual(out, [{name: 'héllo wörld'}]);
    });
});
