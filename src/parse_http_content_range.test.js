const assert = require('assert');
const parse_http_content_range = require('./parse_http_content_range');

const items = [
    ['bytes 262144000-272629759/5037662208', {type: 'bytes', first: 262144000, last: 272629759, total: 5037662208}],
];

describe('parse_http_content_range', function () {
    items.forEach(function ([expr, expected]) {
        it(expr, function () {
            assert.deepStrictEqual(parse_http_content_range(expr), expected);
        });
    });
});
