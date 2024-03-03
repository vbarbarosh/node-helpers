const ignore = require('./ignore');
const stream = require('stream');

function stream_multiplex(...streams)
{
    if (streams.length === 1) {
        return streams[0];
    }

    // `new stream.Writable()` will ignore second, third, etc. calls to `destroy`
    return stream.Writable({
        objectMode: true,
        construct: function (next) {
            streams.forEach(s => s.once('error', e => this.destroy(e)));
            next();
        },
        destroy: async function (error, next) {
            let done = 0;
            streams.forEach(function (stream) {
                stream.destroy(error, function () {
                    if (++done === streams.length) {
                        next();
                    }
                });
            });
        },
        write: async function (chunk, encoding, next) {
            let done = 0;
            streams.forEach(function (stream) {
                stream.write(chunk, encoding, function (error) {
                    if (++done === streams.length || error) {
                        next(error);
                        next = ignore;
                    }
                });
            });
        },
        final: async function (next) {
            let done = 0;
            streams.forEach(function (stream) {
                stream.end(function (error) {
                    if (++done === streams.length || error) {
                        next(error);
                        next = ignore;
                    }
                });
            });
        },
    });
}

module.exports = stream_multiplex;
