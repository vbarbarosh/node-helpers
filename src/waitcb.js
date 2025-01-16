const Promise = require('bluebird');

/**
 * Wait for a Node-like function to finish (which will call `callback`
 * with 2 arguments: `error` and `value`).
 *
 * await waitcb(cb => fs.writeFile('a', 'hello\n', cb));
 */
function waitcb(fn)
{
    return new Promise(function (resolve, reject) {
        fn(function (error, out) {
            error ? reject(error) : resolve(out);
        });
    });
}

module.exports = waitcb;
