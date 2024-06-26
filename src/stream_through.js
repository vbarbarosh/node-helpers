const stream = require('stream');

/**
 * Call `fn` on each item.
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
