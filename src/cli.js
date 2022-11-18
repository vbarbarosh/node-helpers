/**
 * Entry point for Node CLI apps
 */
function cli(main)
{
    // https://stackoverflow.com/a/46916601/1478566
    const timer = setInterval(v => v, 1E9);

    Promise.resolve(main()).then(resolve, reject);

    function resolve() {
        clearInterval(timer);
    }
    function reject(error) {
        clearInterval(timer);
        console.error(error);
        process.exit(1);
    }
}

module.exports = cli;
