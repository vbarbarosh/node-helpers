const crypto = require('crypto');

/**
 *
 * @param data
 * @returns {Buffer}
 * @link https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/#how-to-calculate-hashes-with-crypto
 */
function crypto_hash_sha256(data)
{
    return crypto.createHash('sha256').update(data).digest();
}

module.exports = crypto_hash_sha256;
