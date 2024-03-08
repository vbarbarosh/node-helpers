const stream = require('stream');

function stream_transform(fn)
{
    return new stream.Transform({
        objectMode: true,
        transform: function (item, encoding, next) {
            try {
                this.push(fn(item));
                next();
            }
            catch (error) {
                next(error);
            }
        },
    });
}

module.exports = stream_transform;
