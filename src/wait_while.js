const Promise = require('bluebird');

/**
 * Wait until `fn` returns `true`.
 */
function wait_while(fn)
{
    return new Promise(function (resolve, reject) {
        setTimeout(tick, 1);
        async function tick() {
            try {
                if (await fn()) {
                    setTimeout(tick, 1);
                }
                else {
                    resolve();
                }
            }
            catch (error) {
                reject(error);
            }
        }
    });
}

module.exports = wait_while;
