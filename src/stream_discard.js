const stream = require('stream');

function stream_discard({objectMode = false} = {})
{
    return new stream.Writable({
        objectMode,
        write: function (buffer, encoding, callback) {
            callback();
        },
    });
}

module.exports = stream_discard;
