const Promise = require('bluebird');

/**
 * Wait until `fn` returns `true`.
 *
 * W A R N I N G
 * This method was designed mainly for prototyping (where code cleanliness is important).
 * It might drastically decrease performance.
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
