const stream = require('stream');

/**
 * Call `fn` on each item.
 *
 * TODO Rename to stream_tap
 * TODO Add support for async functions
 */
function stream_through(fn)
{
    return new stream.Transform({
        objectMode: true,
        transform: function (item, encoding, callback) {
            try {
                fn(item);
                this.push(item, encoding);
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
}

module.exports = stream_through;
