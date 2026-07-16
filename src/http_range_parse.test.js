const assert = require('assert');
const http_range_parse = require('./http_range_parse');

const items = [
    // [range, total, expected]
    ['bytes=0-99', 1000, {first: 0, last: 99}],
    ['bytes=500-', 1000, {first: 500, last: 999}],
    ['bytes=-100', 1000, {first: 900, last: 999}],
    ['bytes = 0-99', 1000, {first: 0, last: 99}], // spaces around '=' are allowed
    ['bytes=0-0', 1, {first: 0, last: 0}],

    // Clamping per RFC 7233
    ['bytes=-5000', 100, {first: 0, last: 99}], // suffix longer than the resource → whole resource
    ['bytes=0-999999', 100, {first: 0, last: 99}], // last past the end → reads to the end
];

const throws = [
    // [range, total]
    ['bytes=100-', 100], // first past the end is unsatisfiable
    ['bytes=5-2', 100], // first > last
    ['bytes=-0', 100], // empty suffix
    ['bytes=-', 100],
    ['items=0-9', 100], // unsupported unit expression
    ['0-9', 100],
];

describe('http_range_parse', function () {
    items.forEach(function ([range, total, expected]) {
        it(`${range} of ${total} → ${expected.first}-${expected.last}`, function () {
            assert.deepStrictEqual(http_range_parse(range, total), expected);
        });
    });
    throws.forEach(function ([range, total]) {
        it(`should throw for ${range} of ${total}`, function () {
            assert.throws(() => http_range_parse(range, total));
        });
    });
});
