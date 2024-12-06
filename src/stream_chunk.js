const stream = require('stream');

/**
 * Split a stream into chunks of objects.
 */
function stream_chunk(chunk_size)
{
    const chunk = [];
    return new stream.Transform({
        objectMode: true,
        transform: function (item, encoding, callback) {
            chunk.push(item);
            if (chunk.length >= chunk_size) {
                this.push(chunk.splice(0));
            }
            callback();
        },
        flush: function (callback) {
            if (chunk.length) {
                this.push(chunk.splice(0));
            }
            callback();
        },
    });
}

module.exports = stream_chunk;
