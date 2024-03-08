const stream = require('stream');

/**
 * Call `fn` on each item.
 */
function stream_through(fn)
{
    return new stream.Transform({
        objectMode: true,
        transform: function (item, encoding, next) {
            try {
                fn(item);
                this.push(item, encoding);
                next();
            }
            catch (error) {
                next(error);
            }
        },
    });
}

module.exports = stream_through;
