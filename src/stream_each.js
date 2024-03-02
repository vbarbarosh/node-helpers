const stream = require('stream');

/**
 * Call `fn` on each item.
 */
function stream_each(fn)
{
    return stream.Transform({
        objectMode: true,
        transform: async function (item, encoding, next) {
            try {
                await fn(item);
                this.push(item, encoding);
                next();
            }
            catch (error) {
                next(error);
            }
        },
    });
}

module.exports = stream_each;
