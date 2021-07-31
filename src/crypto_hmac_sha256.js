import crypto from 'crypto';

/**
 *
 * @param password
 * @param data
 * @returns {Buffer}
 * @link https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/#hmac
 */
function crypto_hmac_sha256(password, data)
{
    return crypto.createHmac('sha256', password).update(data).digest();
}

export default crypto_hmac_sha256;
