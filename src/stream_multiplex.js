const ignore = require('./ignore');
const stream = require('stream');
const wait_while = require('./wait_while');

function stream_multiplex(...streams)
{
    // `new stream.Writable()` will ignore second, third, etc. calls to `destroy`
    return stream.Writable({
        objectMode: true,
        construct: function (next) {
            streams.forEach(s => s.once('error', e => this.destroy(e)));
            next();
        },
        destroy: async function (error, next) {
            let running = streams.length;
            streams.forEach(s => s.destroy(error, () => running--));
            await wait_while(() => running > 0);
            next();
        },
        write: async function (chunk, enc, next) {
            let running = streams.length;
            streams.forEach(function (stream) {
                stream.write(chunk, function (error) {
                    running--;
                    if (error) {
                        next(error);
                        next = ignore;
                    }
                });
            });
            await wait_while(() => running > 0);
            next();
        },
        final: async function (next) {
            let running = streams.length;
            streams.forEach(function (stream) {
                stream.end(function (error) {
                    running--;
                    if (error) {
                        next(error);
                        next = ignore;
                    }
                });
            });
            await wait_while(() => running > 0);
            next();
        },
    });
}

module.exports = stream_multiplex;
