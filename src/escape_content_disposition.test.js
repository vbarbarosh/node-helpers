const assert = require('assert');
const escape_content_disposition = require('./escape_content_disposition');
const http = require('http');

const items = [
    ['foo.bar', 'foo.bar'],
    ['foo"bar', '"foo\\"bar"'],
    ['foo;bar', '"foo;bar"'],
    ['foo%bar', '"foo\\%bar"'],
    ['foo\\bar', '"foo\\\\bar"'],
    ['foo\nbar', '"foo%x0Abar"'],
    ['foo\0bar', '"foo%x00bar"'],
    ['foo\rbar', '"foo%x0Dbar"'],
    ['foo\r\nbar', '"foo%x0D%x0Abar"'],
    ['foo\x01bar', '"foo%x01bar"'],
    ['foo\x7fbar', '"foo%x7Fbar"'],
    ['файл.txt', '"????.txt"'],
    ['café.txt', '"café.txt"'], // ISO-8859-1 is representable in a quoted-string
    ['foo bar', '"foo bar"'],
    ['foo "bar".txt', '"foo \\"bar\\".txt"'],
    ['foo,bar.txt', '"foo,bar.txt"'],
    ['', '""'],
];

describe('escape_content_disposition', function () {
    items.forEach(function ([input, expected]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(escape_content_disposition(input), expected);
            http.validateHeaderValue('content-disposition', `attachment; filename=${expected}`);
        });
    });
});
