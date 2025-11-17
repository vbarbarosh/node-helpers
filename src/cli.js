const ExitCodeError = require('./errors/ExitCodeError');
const Promise = require('bluebird');

/**
 * Entry point for Node CLI apps
 */
function cli(main, report = error => console.error(error))
{
    // https://stackoverflow.com/a/46916601/1478566
    const timer = setInterval(v => v, 1E9);

    Promise.resolve(main()).then(resolve, reject);

    function resolve() {
        clearInterval(timer);
    }
    function reject(error) {
        clearInterval(timer);
        report(error);
        if (error instanceof ExitCodeError) {
            process.exit(error.exit_code);
        }
        else {
            process.exit(1);
        }
    }
}

module.exports = cli;
