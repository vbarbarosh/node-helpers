const ExitCodeError = require('./errors/ExitCodeError');
const Promise = require('bluebird');
const child_process = require('child_process');

// 📕 Notes by ChatGPT:
// If the child is killed by a signal (e.g. SIGKILL from outside),
// Node’s exit event gives code = null, signal = 'SIGKILL'.
// Your code treats this as success (resolve).
// That might be fine for your use case, but be aware:
//
// If you want “child died by signal” to be treated as non-zero,
// you’d need to change this check to something like:
//
// > function promise_exit(code, signal) {
// >     out.off('error', promise_error);
// >     if (code === 0) {
// >         resolve(signal);
// >     } else {
// >         reject(new ExitCodeError(code || 128, `Process terminated with code ${code} and signal ${signal}`));
// >     }
// > }

// ⚠️ Both .init and .promise are targets for race conditions!
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
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new ExitCodeError(code || 128, `Process terminated with code ${code} and signal ${signal}`));
                }
            }
        });
    };
    return out;
}

module.exports = shell_spawn;
