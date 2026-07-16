const assert = require('assert');
const crypto_hmac_sha256 = require('./crypto_hmac_sha256');

const items = [
    // [password, data, expected hmac-sha256 hex]
    ['key', 'The quick brown fox jumps over the lazy dog', 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8'],
    ['', '', 'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad'],
];

describe('crypto_hmac_sha256', function () {
    items.forEach(function ([password, data, expected]) {
        it(`hmac(${JSON.stringify(password)}, ${JSON.stringify(data)}) → ${expected}`, function () {
            assert.strictEqual(crypto_hmac_sha256(password, data).toString('hex'), expected);
        });
    });
    it('should produce a different mac for a different password', function () {
        const a = crypto_hmac_sha256('key1', 'hello').toString('hex');
        const b = crypto_hmac_sha256('key2', 'hello').toString('hex');
        assert.notStrictEqual(a, b);
    });
});
