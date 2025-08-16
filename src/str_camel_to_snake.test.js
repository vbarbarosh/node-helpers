const assert = require('assert');
const str_camel_to_snake = require('./str_camel_to_snake');

const items = [
    ['UPC', 'upc'],
    ['CamelCase', 'camel_case'],
    ['SomeUPCCode', 'some_upc_code'],
    ['XMLHTTPRequest', 'xmlhttp_request'],
];

describe('str_camel_to_snake', function () {
    items.forEach(function ([input, expected],) {
        it(`${input === '' ? '☒' : input} → ${expected}`, function () {
            assert.deepStrictEqual(str_camel_to_snake(input), expected);
        });
    });
});
