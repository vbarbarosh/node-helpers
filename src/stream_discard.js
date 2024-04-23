const stream = require('stream');

function stream_discard()
{
    return new stream.Writable({
        write: function (buffer, encoding, callback) {
            callback();
        },
    });
}

module.exports = stream_discard;
