import crypto from 'crypto';

/**
 *
 * @param data
 * @returns {Buffer}
 * @link https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/#how-to-calculate-hashes-with-crypto
 */
function crypto_hash_md5(data)
{
    return crypto.createHash('md5').update(data).digest();
}

export default crypto_hash_md5;
