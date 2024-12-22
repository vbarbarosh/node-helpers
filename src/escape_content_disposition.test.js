const assert = require('assert');
const escape_content_disposition = require('./escape_content_disposition');

const items = [
    ['foo.bar', 'foo.bar'],
    ['foo"bar', 'foo\\"bar'],
    ['foo;bar', '"foo;bar"'],
    ['foo\\bar', 'foo\\\\bar'],
    ['foo bar', '"foo bar"'],
    ['foo "bar".txt', '"foo \\"bar\\".txt"'],
];

describe('escape_content_disposition', function () {
    items.forEach(function ([input, expected]) {
        it(`${input} → ${expected}`, function () {
            assert.strictEqual(escape_content_disposition(input), expected);
        });
    });
});
