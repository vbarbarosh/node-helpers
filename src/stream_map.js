const stream = require('stream');

/**
 * Transform each item using a simple function.
 */
function stream_map(fn)
{
    return new stream.Transform({
        objectMode: true,
        transform: async function (item, encoding, callback) {
            try {
                this.push(await fn(item));
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
}

module.exports = stream_map;
