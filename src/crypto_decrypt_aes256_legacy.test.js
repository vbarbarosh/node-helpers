const assert = require('assert');
const crypto = require('crypto');
const crypto_decrypt_aes256 = require('./crypto_decrypt_aes256');
const crypto_decrypt_aes256_legacy = require('./crypto_decrypt_aes256_legacy');
const crypto_encrypt_aes256 = require('./crypto_encrypt_aes256');

// crypto_encrypt_aes256 as it was up to v3.78.0
function encrypt_v3_78_0(password, data)
{
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash('sha256').update(password).digest();
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    return Buffer.concat([Buffer.from([iv.length]), iv, cipher.update(data), cipher.final()]);
}

describe('crypto_decrypt_aes256_legacy', function () {
    it('should decrypt the fixed vector the suite used until v3.78.0', function () {
        // aes-256-ctr, key=sha256('pass123'), iv=000102...0f, data='hello'
        const ivenc = Buffer.from('10000102030405060708090a0b0c0d0e0f27897103cc', 'hex');
        assert.strictEqual(crypto_decrypt_aes256_legacy('pass123', ivenc).toString('utf8'), 'hello');
    });
    it('should read what the old encrypt wrote: binary, unicode and empty data', function () {
        const binary = Buffer.from(Array.from({length: 256}, (v, i) => i));
        assert.deepStrictEqual(crypto_decrypt_aes256_legacy('pass123', encrypt_v3_78_0('pass123', binary)), binary);
        const text = 'привіт 👋 emoji';
        assert.strictEqual(crypto_decrypt_aes256_legacy('pass123', encrypt_v3_78_0('pass123', text)).toString('utf8'), text);
        assert.deepStrictEqual(crypto_decrypt_aes256_legacy('pass123', encrypt_v3_78_0('pass123', '')), Buffer.alloc(0));
    });
    it('should accept a Uint8Array envelope', function () {
        const ivenc = encrypt_v3_78_0('pass123', 'hello');
        const view = new Uint8Array(ivenc.buffer, ivenc.byteOffset, ivenc.byteLength);
        assert.strictEqual(crypto_decrypt_aes256_legacy('pass123', view).toString('utf8'), 'hello');
    });
    it('should move old data to the current format: read old, encrypt, read new', function () {
        const old = encrypt_v3_78_0('pass123', 'kept since 2024');
        const moved = crypto_encrypt_aes256('pass123', crypto_decrypt_aes256_legacy('pass123', old));
        assert.strictEqual(moved[0], 1);
        assert.strictEqual(crypto_decrypt_aes256('pass123', moved).toString('utf8'), 'kept since 2024');
    });
    it('should return garbage, not throw, for a wrong password: the old format has no integrity check', function () {
        const ivenc = encrypt_v3_78_0('pass123', 'hello');
        assert.notStrictEqual(crypto_decrypt_aes256_legacy('wrong', ivenc).toString('utf8'), 'hello');
    });
    it('should refuse an envelope in the current format', function () {
        assert.throws(() => crypto_decrypt_aes256_legacy('pass123', crypto_encrypt_aes256('pass123', 'hello')), /not an envelope written before v3\.78\.1/);
    });
    it('should refuse a short envelope, another first byte and a non-buffer', function () {
        assert.throws(() => crypto_decrypt_aes256_legacy('pass123', Buffer.from([16, 0, 0])), /not an envelope written before v3\.78\.1/);
        assert.throws(() => crypto_decrypt_aes256_legacy('pass123', Buffer.alloc(17, 8)), /not an envelope written before v3\.78\.1/);
        assert.throws(() => crypto_decrypt_aes256_legacy('pass123', Buffer.alloc(0)), /not an envelope written before v3\.78\.1/);
        assert.throws(() => crypto_decrypt_aes256_legacy('pass123', 'not a buffer'), /should be a Buffer/);
        assert.throws(() => crypto_decrypt_aes256_legacy('pass123', null), /should be a Buffer/);
    });
});
