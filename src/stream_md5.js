const crypto = require('crypto');
const stream = require('stream');

function stream_md5()
{
    const md5 = crypto.createHash('md5');
    return new stream.Transform({
        transform: function (chunk, encoding, next) {
            md5.update(chunk);
            next();
        },
        flush: function (next) {
            this.push(md5.digest());
            next();
        },
    });
}

module.exports = stream_md5;
