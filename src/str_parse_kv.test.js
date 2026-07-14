const assert = require('assert');
const str_parse_kv = require('./str_parse_kv');

const items = [
    // Basic key:value
    ['key:value', ['key', 'value']],
    ['key: value', ['key', 'value']],
    ['  key  :  value  ', ['key', 'value']],

    // Only the first colon splits; the rest stays in the value
    ['url:http://example.com', ['url', 'http://example.com']],
    ['a:b:c', ['a', 'b:c']],

    // Empty key or value
    [':value', ['', 'value']],
    ['key:', ['key', '']],
    [':', ['', '']],

    // No colon → whole string is the key, value is empty
    ['key', ['key', '']],
    ['  key  ', ['key', '']],

    // Empty input
    ['', ['', '']],
];

describe('str_parse_kv', function () {
    items.forEach(function ([input, expected]) {
        it(`${JSON.stringify(input)} → ${JSON.stringify(expected)}`, function () {
            assert.deepStrictEqual(str_parse_kv(input), expected);
        });
    });
});
