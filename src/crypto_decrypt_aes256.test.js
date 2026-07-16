const assert = require('assert');
const crypto_decrypt_aes256 = require('./crypto_decrypt_aes256');
const crypto_encrypt_aes256 = require('./crypto_encrypt_aes256');

describe('crypto_decrypt_aes256', function () {
    it('should decrypt a fixed vector', function () {
        // aes-256-ctr, key=sha256('pass123'), iv=000102...0f, data='hello'
        const ivenc = Buffer.from('10000102030405060708090a0b0c0d0e0f27897103cc', 'hex');
        assert.strictEqual(crypto_decrypt_aes256('pass123', ivenc).toString('utf8'), 'hello');
    });
    it('should roundtrip binary data', function () {
        const data = Buffer.from(Array.from({length: 256}, (v, i) => i));
        assert.deepStrictEqual(crypto_decrypt_aes256('pass123', crypto_encrypt_aes256('pass123', data)), data);
    });
    it('should roundtrip unicode text', function () {
        const text = 'привіт 👋 emoji';
        assert.strictEqual(crypto_decrypt_aes256('pass123', crypto_encrypt_aes256('pass123', text)).toString('utf8'), text);
    });
    it('should produce garbage for a wrong password (CTR mode has no integrity check)', function () {
        const ivenc = crypto_encrypt_aes256('pass123', 'hello');
        assert.notStrictEqual(crypto_decrypt_aes256('wrong', ivenc).toString('utf8'), 'hello');
    });
});
