const assert = require('assert');
const crypto_decrypt_aes256 = require('./crypto_decrypt_aes256');
const crypto_encrypt_aes256 = require('./crypto_encrypt_aes256');

describe('crypto_encrypt_aes256', function () {
    it('should handle basic input', function () {
        const password = 'pass123';
        assert.deepStrictEqual(crypto_decrypt_aes256(password, crypto_encrypt_aes256(password, 'hello')).toString('utf8'), 'hello');
    });
    it('should emit a version 1 envelope: [0x01][16-byte salt][12-byte nonce][16-byte tag][ciphertext]', function () {
        const envelope = crypto_encrypt_aes256('pass123', 'hello');
        assert.ok(Buffer.isBuffer(envelope));
        assert.strictEqual(envelope.length, 1 + 16 + 12 + 16 + 5);
        assert.strictEqual(envelope[0], 1);
    });
    it('should use a fresh salt and nonce on every call', function () {
        const a = crypto_encrypt_aes256('pass123', 'hello');
        const b = crypto_encrypt_aes256('pass123', 'hello');
        assert.notDeepStrictEqual(a.subarray(1, 17), b.subarray(1, 17));
        assert.notDeepStrictEqual(a.subarray(17, 29), b.subarray(17, 29));
        assert.notDeepStrictEqual(a, b);
    });
    it('should accept an empty payload', function () {
        const envelope = crypto_encrypt_aes256('pass123', '');
        assert.strictEqual(envelope.length, 45);
        assert.deepStrictEqual(crypto_decrypt_aes256('pass123', envelope), Buffer.alloc(0));
    });
});
