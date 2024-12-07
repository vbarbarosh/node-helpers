const crypto = require('crypto');

/**
 * Returns random bytes in hexadecimal format.
 */
function random_hex(bytes = 32)
{
    return crypto.randomBytes(bytes).toString('hex');
}

module.exports = random_hex;
