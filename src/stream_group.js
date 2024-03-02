const stream = require('stream');

/**
 * Returns a transform stream used to group object into chunks of objects.
 */
function stream_group(chunk_size)
{
    const chunk = [];
    return new stream.Transform({
        objectMode: true,
        transform: function (item, encoding, next) {
            chunk.push(item);
            if (chunk.length >= chunk_size) {
                this.push(chunk.splice(0));
            }
            next();
        },
        flush: function (next) {
            if (chunk.length) {
                this.push(chunk.splice(0));
            }
            next();
        },
    });
}

module.exports = stream_group;
