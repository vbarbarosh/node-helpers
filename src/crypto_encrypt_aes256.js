const crypto = require('crypto');

const VERSION = 1;
const SALT_LENGTH = 16;
const NONCE_LENGTH = 12;

/**
 * Authenticated encryption with a password.
 *
 * Envelope (version 1):
 *     [0x01][16-byte salt][12-byte nonce][16-byte GCM tag][ciphertext]
 *
 * The key is scrypt(password, salt, 32) and the version/salt/nonce header
 * is authenticated together with the ciphertext (AES-256-GCM with the
 * header as additional data), so any modification is detected on decrypt.
 *
 * @link https://nodejs.org/api/crypto.html#cryptoscryptsyncpassword-salt-keylen-options
 * @link https://nodejs.org/api/crypto.html#class-cipher
 */
function crypto_encrypt_aes256(password, data)
{
    const salt = crypto.randomBytes(SALT_LENGTH);
    const nonce = crypto.randomBytes(NONCE_LENGTH);
    const key = crypto.scryptSync(password, salt, 32);
    const header = Buffer.concat([Buffer.from([VERSION]), salt, nonce]);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
    cipher.setAAD(header);
    const enc = Buffer.concat([cipher.update(data), cipher.final()]);
    return Buffer.concat([header, cipher.getAuthTag(), enc]);
}

module.exports = crypto_encrypt_aes256;
