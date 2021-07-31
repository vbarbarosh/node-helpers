import crypto from 'crypto';

/**
 * @link https://nodejs.org/api/crypto.html#crypto_class_cipher
 * @link https://attacomsian.com/blog/nodejs-encrypt-decrypt-data
 */
function crypto_encrypt_aes256(password, data)
{
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash('sha256').update(password).digest();
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    if (iv.length > 255) {
        throw new Error('iv size is too big');
    }
    return Buffer.concat([Buffer.from([iv.length]), iv, cipher.update(data), cipher.final()]);
}

export default crypto_encrypt_aes256;
