const crypto = require('crypto');
const stream = require('stream');

/**
 * TODO Rename to stream_hash_md5
 */
function stream_md5()
{
    const md5 = crypto.createHash('md5');
    return new stream.Transform({
        transform: function (chunk, encoding, callback) {
            md5.update(chunk, encoding);
            callback();
        },
        flush: function (callback) {
            this.push(md5.digest('hex'));
            callback();
        },
    });
}

module.exports = stream_md5;
