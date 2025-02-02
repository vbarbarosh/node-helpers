const assert = require('assert');
const sanitize_var_name = require('./sanitize_var_name');

const items = [
    ['', '_'],
    [' ', '_'],
    ['   ', '_'],
    ['Product ID', 'product_id'],
    ['Product-ID', 'product_id'],
    ['Image URL', 'image_url'],
    ['Ópera Prima', 'opera_prima'],
    ['1000-stories', '_1000_stories'],
    ['A, C, D', 'a_c_d'],
];

describe('sanitize_var_name', function () {
    items.forEach(function ([input, expected],) {
        it(`${input === '' ? '☒' : input} → ${expected}`, function () {
            assert.deepStrictEqual(sanitize_var_name(input), expected);
        });
    });
});
