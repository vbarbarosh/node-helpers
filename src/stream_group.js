const stream = require('stream');

/**
 * Returns a transform stream used to group object into chunks of objects.
 *
 * TODO Rename to stream_chunk
 */
function stream_group(chunk_size)
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

module.exports = stream_group;
