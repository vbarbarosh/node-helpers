const child_process = require('child_process');

function shell_stdall(args, options)
{
    return new Promise(function (resolve, reject) {
        child_process.execFile(args[0], args.slice(1), options, function (error, stdout, stderr) {
            error ? reject(error) : resolve({stdout, stderr});
        });
    });
}

module.exports = shell_stdall;
