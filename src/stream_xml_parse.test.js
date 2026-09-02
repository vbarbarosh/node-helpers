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
    describe('reserved element names', function () {
        [
            // [name, xml, expected own properties as [key, value] pairs]
            ['__proto__', '<root><item><__proto__>z</__proto__><a>1</a></item></root>', [['__proto__', 'z'], ['a', '1']]],
            ['constructor', '<root><item><constructor>x</constructor><a>1</a></item></root>', [['constructor', 'x'], ['a', '1']]],
            ['toString', '<root><item><a>1</a><toString>x</toString><toString>y</toString></item></root>', [['a', '1'], ['toString', ['x', 'y']]]],
            ['hasOwnProperty', '<root><item><hasOwnProperty>x</hasOwnProperty><a>1</a></item></root>', [['hasOwnProperty', 'x'], ['a', '1']]],
        ].forEach(function ([name, xml, expected]) {
            it(`should keep <${name}> as an own data property`, async function () {
                const out = await stream.Readable.from([xml]).pipe(stream_xml_parse(['root', 'item'])).toArray();
                assert.strictEqual(out.length, 1);
                assert.strictEqual(Object.getPrototypeOf(out[0]), Object.prototype);
                assert.deepStrictEqual(Object.keys(out[0]), expected.map(v => v[0]));
                expected.forEach(function ([key, value]) {
                    assert.deepStrictEqual(Object.getOwnPropertyDescriptor(out[0], key).value, value);
                });
            });
        });
    });
});
