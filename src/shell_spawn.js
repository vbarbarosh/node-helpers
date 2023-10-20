const child_process = require('child_process');

function shell_spawn(args, options)
{
    let promise;
    const proc = child_process.spawn(args[0], args.slice(1), options);
    proc.promise = function () {
        let is_pending = true;
        return promise = promise || new Promise(function (resolve, reject) {
            proc.on('error', on_error);
            proc.on('exit', on_exit);
            function on_error(error) {
                if (is_pending) {
                    is_pending = false;
                    proc.off('error', on_error);
                    proc.off('exit', on_exit);
                    reject(error);
                }
            }
            function on_exit(code, signal) {
                if (is_pending) {
                    is_pending = false;
                    proc.off('error', on_error);
                    proc.off('exit', on_exit);
                    resolve({code, signal});
                }
            }
        });
    };
    return proc;
}

module.exports = shell_spawn;
