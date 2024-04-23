const stream = require('stream');

/**
 * Transform each item by simple function.
 */
function stream_map(fn)
{
    return new stream.Transform({
        objectMode: true,
        transform: function (item, encoding, callback) {
            try {
                this.push(fn(item));
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
}

module.exports = stream_map;
