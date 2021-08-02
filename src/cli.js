/**
 * Entry point for Node CLI apps
 *
 * @link https://github.com/vbarbarosh/node-cli
 */
async function cli(main)
{
    // https://stackoverflow.com/a/46916601/1478566
    const timer = setInterval(v => v, 1E9);

    try {
        return await main();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
    finally {
        clearInterval(timer);
    }
}

// import Promise from 'bluebird';
//
// // https://stackoverflow.com/a/57241059/1478566
// function cli(main)
// {
//     // https://stackoverflow.com/a/46916601/1478566
//     return Promise.method(main).call().catch(panic).finally(clearInterval.bind(null, setInterval(v=>v, 1E9)));
// }
//
// function panic(error)
// {
//     console.error(error);
//     process.exit(1);
// }

export default cli;
