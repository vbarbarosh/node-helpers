const crypto = require('crypto');

const VERSION = 1;
const SALT_LENGTH = 16;
const NONCE_LENGTH = 12;
const TAG_LENGTH = 16;
const HEADER_LENGTH = 1 + SALT_LENGTH + NONCE_LENGTH;

/**
 * Decrypts an envelope produced by crypto_encrypt_aes256. Throws when the
 * envelope is malformed, the password is wrong, or the data was tampered
 * with.
 *
 * @link https://nodejs.org/api/crypto.html#class-decipher
 */
function crypto_decrypt_aes256(password, ivenc)
{
    if (!(ivenc instanceof Uint8Array)) {
        throw new Error('crypto_decrypt_aes256: envelope should be a Buffer');
    }
    if (!Buffer.isBuffer(ivenc)) {
        ivenc = Buffer.from(ivenc.buffer, ivenc.byteOffset, ivenc.byteLength);
    }
    if (ivenc[0] !== VERSION) {
        throw new Error('crypto_decrypt_aes256: malformed envelope');
    }
    return decrypt_v1(password, ivenc);
}

function decrypt_v1(password, ivenc)
{
    if (ivenc.length < HEADER_LENGTH + TAG_LENGTH) {
        throw new Error('crypto_decrypt_aes256: malformed envelope');
    }
    const header = ivenc.subarray(0, HEADER_LENGTH);
    const salt = ivenc.subarray(1, 1 + SALT_LENGTH);
    const nonce = ivenc.subarray(1 + SALT_LENGTH, HEADER_LENGTH);
    const tag = ivenc.subarray(HEADER_LENGTH, HEADER_LENGTH + TAG_LENGTH);
    const enc = ivenc.subarray(HEADER_LENGTH + TAG_LENGTH);
    const key = crypto.scryptSync(password, salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
    decipher.setAAD(header);
    decipher.setAuthTag(tag);
    try {
        return Buffer.concat([decipher.update(enc), decipher.final()]);
    }
    catch (error) {
        throw new Error('crypto_decrypt_aes256: authentication failed (wrong password or tampered data)', {cause: error});
    }
}

module.exports = crypto_decrypt_aes256;
