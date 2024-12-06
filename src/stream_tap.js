const stream = require('stream');

/**
 * Call `fn` on each item.
 */
function stream_tap(fn)
{
    return new stream.Transform({
        objectMode: true,
        transform: async function (item, encoding, callback) {
            try {
                await fn(item);
                this.push(item, encoding);
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
}

module.exports = stream_tap;
