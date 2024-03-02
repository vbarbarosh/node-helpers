const stream = require('stream');

function stream_discard()
{
    return new stream.Writable({
        write: function (buf, encoding, next) {
            next();
        },
    });
}

module.exports = stream_discard;
