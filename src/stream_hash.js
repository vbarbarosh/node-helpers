const crypto = require('crypto');
const stream = require('stream');

function stream_hash(algorithm = 'md5', options)
{
    const hash = crypto.createHash(algorithm, options);
    return new stream.Transform({
        transform: function (chunk, encoding, callback) {
            hash.update(chunk);
            callback();
        },
        flush: function (callback) {
            this.push(hash.digest('hex'));
            callback();
        },
    });
}

module.exports = stream_hash;
