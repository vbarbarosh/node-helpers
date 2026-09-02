const assert = require('assert');
const crypto_decrypt_aes256 = require('./crypto_decrypt_aes256');
const crypto_encrypt_aes256 = require('./crypto_encrypt_aes256');

describe('crypto_decrypt_aes256', function () {
    it('should decrypt a fixed version 1 vector', function () {
        // version=01, salt=000102...0f, nonce=101112...1b, key=scrypt('pass123', salt, 32), data='hello'
        const envelope = Buffer.from('01000102030405060708090a0b0c0d0e0f101112131415161718191a1bc35fb244f907aedf7c0d3b832c0389d4e2a58c7e83', 'hex');
        assert.strictEqual(crypto_decrypt_aes256('pass123', envelope).toString('utf8'), 'hello');
    });
    it('should reject the old unauthenticated aes-256-ctr envelope', function () {
        // aes-256-ctr, key=sha256('pass123'), iv=000102...0f, data='hello'
        const ivenc = Buffer.from('10000102030405060708090a0b0c0d0e0f27897103cc', 'hex');
        assert.throws(() => crypto_decrypt_aes256('pass123', ivenc), /malformed envelope/);
    });
    it('should roundtrip binary data', function () {
        const data = Buffer.from(Array.from({length: 256}, (v, i) => i));
        assert.deepStrictEqual(crypto_decrypt_aes256('pass123', crypto_encrypt_aes256('pass123', data)), data);
    });
    it('should roundtrip unicode text', function () {
        const text = 'привіт 👋 emoji';
        assert.strictEqual(crypto_decrypt_aes256('pass123', crypto_encrypt_aes256('pass123', text)).toString('utf8'), text);
    });
    it('should accept a Uint8Array envelope', function () {
        const envelope = crypto_encrypt_aes256('pass123', 'hello');
        const view = new Uint8Array(envelope.buffer, envelope.byteOffset, envelope.byteLength);
        assert.strictEqual(crypto_decrypt_aes256('pass123', view).toString('utf8'), 'hello');
    });
    it('should throw for a wrong password', function () {
        const envelope = crypto_encrypt_aes256('pass123', 'hello');
        assert.throws(() => crypto_decrypt_aes256('wrong', envelope), /authentication failed/);
    });
    it('should throw when any byte of the envelope is tampered with', function () {
        const envelope = crypto_encrypt_aes256('password', 'admin=false');
        // version, salt, nonce, tag, and ciphertext bytes
        [0, 1, 16, 17, 28, 29, 44, 45, envelope.length - 1].forEach(function (i) {
            const tampered = Buffer.from(envelope);
            tampered[i] ^= 1;
            assert.throws(() => crypto_decrypt_aes256('password', tampered), /authentication failed|malformed envelope/, `byte ${i}`);
        });
    });
    it('should throw when the envelope is truncated', function () {
        const envelope = crypto_encrypt_aes256('pass123', 'hello');
        assert.throws(() => crypto_decrypt_aes256('pass123', envelope.subarray(0, envelope.length - 1)), /authentication failed/);
        assert.throws(() => crypto_decrypt_aes256('pass123', envelope.subarray(0, 44)), /malformed envelope/);
        assert.throws(() => crypto_decrypt_aes256('pass123', Buffer.from([1])), /malformed envelope/);
        assert.throws(() => crypto_decrypt_aes256('pass123', Buffer.from([16, 0, 0])), /malformed envelope/);
    });
    it('should throw for an unknown version or a non-buffer envelope', function () {
        assert.throws(() => crypto_decrypt_aes256('pass123', Buffer.from([2, 0, 0, 0])), /malformed envelope/);
        assert.throws(() => crypto_decrypt_aes256('pass123', Buffer.alloc(0)), /malformed envelope/);
        assert.throws(() => crypto_decrypt_aes256('pass123', 'not a buffer'), /should be a Buffer/);
        assert.throws(() => crypto_decrypt_aes256('pass123', null), /should be a Buffer/);
    });
});
