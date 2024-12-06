const stream = require('stream');

/**
 * Pass each item to a simple function. This is a final step.
 */
function stream_each(fn)
{
    return stream.Writable({
        objectMode: true,
        write: async function (item, encoding, callback) {
            try {
                await fn(item);
                callback();
            }
            catch (error) {
                callback(error);
            }
        }
    });
}

module.exports = stream_each;
