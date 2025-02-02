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
    ['@odata.etag', 'odata_etag'],
    ['ItemInternalId', 'item_internal_id'],
    ['UPC', 'upc'],
    ['Sale_price', 'sale_price'],
    ['% de disponibilidad de tiendas', 'de_disponibilidad_de_tiendas'],
    ['%Tiendas con precio moda', 'tiendas_con_precio_moda'],

    // https://github.com/Advanon/sanitize-s3-objectkey
    // https://github.com/hamxabaig/s3-filename
    // ['some  漢字 ćööł %  #fíłéñàmé.jpg', 'some_cool_filename_jpg'],
];

describe('sanitize_var_name', function () {
    items.forEach(function ([input, expected],) {
        it(`${input === '' ? '☒' : input} → ${expected}`, function () {
            assert.deepStrictEqual(sanitize_var_name(input), expected);
        });
    });
});
