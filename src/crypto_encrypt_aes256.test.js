const assert = require('assert');
const crypto_decrypt_aes256 = require('./crypto_decrypt_aes256');
const crypto_encrypt_aes256 = require('./crypto_encrypt_aes256');

describe('crypto_encrypt_aes256', function () {
    it('should handle basic input', function () {
        const password = 'pass123';
        assert.deepStrictEqual(crypto_decrypt_aes256(password, crypto_encrypt_aes256(password, 'hello')).toString('utf8'), 'hello');
    });
});
