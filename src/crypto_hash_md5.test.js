const assert = require('assert');
const crypto_hash_md5 = require('./crypto_hash_md5');

const items = [
    // [input, expected md5 hex]
    ['', 'd41d8cd98f00b204e9800998ecf8427e'],
    ['hello', '5d41402abc4b2a76b9719d911017c592'],
    ['The quick brown fox jumps over the lazy dog', '9e107d9d372bb6826bd81d3542a419d6'],
];

describe('crypto_hash_md5', function () {
    items.forEach(function ([input, expected]) {
        it(`md5(${JSON.stringify(input)}) → ${expected}`, function () {
            assert.strictEqual(crypto_hash_md5(input).toString('hex'), expected);
        });
    });
    it('should accept a Buffer', function () {
        assert.strictEqual(crypto_hash_md5(Buffer.from('hello')).toString('hex'), '5d41402abc4b2a76b9719d911017c592');
    });
});
