const assert = require('assert');
const stream = require('stream');
const stream_each = require('./stream_each');
const stream_xml_analyze = require('./stream_xml_analyze');

describe('stream_xml_analyze', function () {
    it('should count elements by path', async function () {
        const out = [];
        const xml = '<root><item><name>a</name></item><item/></root>';
        await stream.promises.pipeline(
            stream.Readable.from([Buffer.from(xml)]),
            stream_xml_analyze(),
            stream_each(v => out.push(v)),
        );
        assert.deepStrictEqual(out, [{'root': 1, 'root > item': 2, 'root > item > name': 1}]);
    });
    it('should not corrupt multi-byte utf8 split across chunks', async function () {
        const out = [];
        const xml = Buffer.from('<root><wörld /></root>');
        const chunks = [];
        for (let i = 0; i < xml.length; ++i) {
            chunks.push(xml.subarray(i, i + 1)); // 1-byte chunks: the worst case
        }
        await stream.promises.pipeline(
            stream.Readable.from(chunks),
            stream_xml_analyze(),
            stream_each(v => out.push(v)),
        );
        assert.deepStrictEqual(out, [{'root': 1, 'root > wörld': 1}]);
    });
    ['__proto__', 'constructor', 'toString', 'hasOwnProperty'].forEach(function (name) {
        it(`should count a root element named <${name}> as an own data property`, async function () {
            const out = [];
            const xml = `<${name}><${name}/><${name}/></${name}>`;
            await stream.promises.pipeline(
                stream.Readable.from([xml]),
                stream_xml_analyze(),
                stream_each(v => out.push(v)),
            );
            assert.strictEqual(out.length, 1);
            assert.strictEqual(Object.getPrototypeOf(out[0]), Object.prototype);
            assert.deepStrictEqual(Object.keys(out[0]), [name, `${name} > ${name}`]);
            assert.strictEqual(Object.getOwnPropertyDescriptor(out[0], name).value, 1);
            assert.strictEqual(out[0][`${name} > ${name}`], 2);
        });
    });
});
