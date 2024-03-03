const crypto = require('crypto');
const stream = require('stream');

function stream_hash(algorithm = 'md5', options)
{
    const hash = crypto.createHash(algorithm, options);
    return new stream.Transform({
        transform: function (chunk, encoding, next) {
            hash.update(chunk);
            next();
        },
        flush: function (next) {
            this.push(hash.digest('hex'));
            next();
        },
    });
}

module.exports = stream_hash;
