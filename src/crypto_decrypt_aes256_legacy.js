const crypto = require('crypto');

const IV_LENGTH = 16;

/**
 * Reads an envelope written by crypto_encrypt_aes256 before v3.78.1:
 *     [0x10][16-byte iv][aes-256-ctr ciphertext], key = sha256(password)
 *
 * For migration only. That format has no integrity check: a wrong password
 * or a modified envelope returns garbage instead of throwing. Read the old
 * data once and write it again with crypto_encrypt_aes256.
 *
 * @link https://nodejs.org/api/crypto.html#class-decipher
 */
function crypto_decrypt_aes256_legacy(password, ivenc)
{
    if (!(ivenc instanceof Uint8Array)) {
        throw new Error('crypto_decrypt_aes256_legacy: envelope should be a Buffer');
    }
    if (!Buffer.isBuffer(ivenc)) {
        ivenc = Buffer.from(ivenc.buffer, ivenc.byteOffset, ivenc.byteLength);
    }
    // An old envelope starts with the length of its iv, always 16
    if (ivenc[0] !== IV_LENGTH || ivenc.length < 1 + IV_LENGTH) {
        throw new Error('crypto_decrypt_aes256_legacy: not an envelope written before v3.78.1');
    }
    const key = crypto.createHash('sha256').update(password).digest();
    const iv = ivenc.subarray(1, 1 + IV_LENGTH);
    const enc = ivenc.subarray(1 + IV_LENGTH);
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    return Buffer.concat([decipher.update(enc), decipher.final()]);
}

module.exports = crypto_decrypt_aes256_legacy;
