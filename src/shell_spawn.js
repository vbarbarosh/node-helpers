const Promise = require('bluebird');
const child_process = require('child_process');

function shell_spawn(args, options)
{
    let init, promise;
    const out = child_process.spawn(args[0], args.slice(1), options);
    out.init = function () {
        return init = init || new Promise(function (resolve, reject) {
            out.once('error', init_error);
            out.once('spawn', init_spawn);
            function init_error(error) {
                out.off('spawn', init_spawn);
                reject(error);
            }
            function init_spawn() {
                out.off('error', init_error);
                resolve(out);
            }
        });
    };
    out.promise = function () {
        return promise = promise || new Promise(function (resolve, reject) {
            out.once('error', promise_error);
            out.once('exit', promise_exit);
            function promise_error(error) {
                out.off('exit', promise_exit);
                reject(error);
            }
            function promise_exit(code, signal) {
                out.off('error', promise_error);
                code ? reject(new Error(`Process terminated with code ${code}`)) : resolve(signal);
            }
        });
    };
    return out;
}

module.exports = shell_spawn;
