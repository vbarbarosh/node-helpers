import crypto from 'crypto';

/**
 * @link https://nodejs.org/api/crypto.html#crypto_class_cipher
 * @link https://attacomsian.com/blog/nodejs-encrypt-decrypt-data
 */
function crypto_decrypt_aes256(password, ivenc)
{
    const key = crypto.createHash('sha256').update(password).digest();
    const iv = ivenc.slice(1, ivenc[0] + 1);
    const enc = ivenc.slice(ivenc[0] + 1);
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    return Buffer.concat([decipher.update(enc), decipher.final()]);
}

export default crypto_decrypt_aes256;
