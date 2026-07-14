const stream = require('stream');

/**
 * Transform each item using a simple function.
 *
 * Returning null or undefined from `fn` drops the item: streams cannot
 * carry null (it is an eof mark), so pushing it would end the stream and
 * silently discard everything after it.
 */
function stream_map(fn)
{
    return new stream.Transform({
        objectMode: true,
        transform: async function (item, encoding, callback) {
            try {
                const out = await fn(item);
                if (out !== null && out !== undefined) {
                    this.push(out);
                }
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
}

module.exports = stream_map;
