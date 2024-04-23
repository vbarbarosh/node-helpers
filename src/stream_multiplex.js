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
        construct: function (callback) {
            streams.forEach(s => s.once('error', e => this.destroy(e)));
            callback();
        },
        destroy: async function (error, callback) {
            let done = 0;
            streams.forEach(function (stream) {
                stream.destroy(error, function () {
                    if (++done === streams.length) {
                        callback();
                    }
                });
            });
        },
        write: async function (chunk, encoding, callback) {
            let done = 0;
            streams.forEach(function (stream) {
                stream.write(chunk, encoding, function (error) {
                    if (++done === streams.length || error) {
                        callback(error);
                        callback = ignore;
                    }
                });
            });
        },
        final: async function (callback) {
            let done = 0;
            streams.forEach(function (stream) {
                stream.end(function (error) {
                    if (++done === streams.length || error) {
                        callback(error);
                        callback = ignore;
                    }
                });
            });
        },
    });
}

module.exports = stream_multiplex;
