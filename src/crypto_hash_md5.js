const crypto = require('crypto');

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

module.exports = crypto_hash_md5;
