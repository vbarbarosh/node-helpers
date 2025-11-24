const ExitCodeError = require('./errors/ExitCodeError');
const Promise = require('bluebird');
const child_process = require('child_process');
const ignore = require('./ignore');

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

function shell_spawn(args, options)
{
    const init = {};
    const run = {};

    init.promise = new Promise(function (resolve, reject) {
        init.resolve = resolve;
        init.reject = reject;
    });
    run.promise = new Promise(function (resolve, reject) {
        run.resolve = resolve;
        run.reject = reject;
    });

    const out = child_process.spawn(args[0], args.slice(1), options);
    out.once('error', onerror);
    out.once('spawn', onspawn);
    out.once('exit', onexit);
    out.init = () => init.promise;
    out.promise = () => run.promise;
    return out;

    function onerror(error) {
        init.reject(error);
        run.reject(error);
    }
    function onexit(code, signal) {
        if (code === 0) {
            run.resolve();
        }
        else {
            run.reject(new ExitCodeError(code || 128, `Process terminated with code ${code} and signal ${signal}`));
        }
    }
    function onspawn() {
        init.resolve(out);
        init.reject = ignore;
    }
}

module.exports = shell_spawn;
