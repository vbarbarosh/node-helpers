const assert = require('assert');
const camel_to_snake = require('./camel_to_snake');

const items = [
    ['UPC', 'upc'],
    ['CamelCase', 'camel_case'],
    ['SomeUPCCode', 'some_upc_code'],
    ['XMLHTTPRequest', 'xmlhttp_request'],
];

describe('camel_to_snake', function () {
    items.forEach(function ([input, expected],) {
        it(`${input === '' ? '☒' : input} → ${expected}`, function () {
            assert.deepStrictEqual(camel_to_snake(input), expected);
        });
    });
});
