const stream = require('stream');

/**
 * Pass each item through a user-defined generator, passes down each yielded item.
 */
function stream_map_flatten(fn)
{
    return new stream.Transform({
        objectMode: true,
        transform: async function (item, encoding, callback) {
            try {
                for await (const chunk of fn(item)) {
                    this.push(chunk);
                }
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
}

module.exports = stream_map_flatten;
