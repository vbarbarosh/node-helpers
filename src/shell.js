const child_process = require('child_process');

function shell(args, options)
{
    return new Promise(function (resolve, reject) {
        child_process.execFile(args[0], args.slice(1), options, function (error, stdout, stderr) {
            if (error) {
                reject(error);
            }
            else if (stderr) {
                reject(new Error(`Process terminated with the following STDERR:\n\n${stderr}`));
            }
            else {
                resolve(stdout);
            }
        });
    });
}

module.exports = shell;
