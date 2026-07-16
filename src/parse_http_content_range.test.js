const assert = require('assert');
const parse_http_content_range = require('./parse_http_content_range');

const items = [
    ['bytes 262144000-272629759/5037662208', {type: 'bytes', first: 262144000, last: 272629759, total: 5037662208}],
    ['bytes 0-499/1000', {type: 'bytes', first: 0, last: 499, total: 1000}],
    ['bytes */5000', {type: 'bytes', first: null, last: null, total: 5000}], // unsatisfied range
    ['bytes 0-499/*', {type: 'bytes', first: 0, last: 499, total: null}], // unknown total
];

const throws = [
    'bytes */*', // not in the RFC 7233 grammar
    'bytes 0-499',
    '0-499/1000',
    '',
];

describe('parse_http_content_range', function () {
    items.forEach(function ([expr, expected]) {
        it(expr, function () {
            assert.deepStrictEqual(parse_http_content_range(expr), expected);
        });
    });
    throws.forEach(function (expr) {
        it(`should throw for "${expr}"`, function () {
            assert.throws(() => parse_http_content_range(expr));
        });
    });
});
