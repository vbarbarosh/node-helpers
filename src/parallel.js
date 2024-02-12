const NotImplemented = require('./errors/NotImplemented');

/**
 * - Run until `spawn` return `null`.
 * - Keep no more than `concurrency` number of workers at a time.
 */
async function parallel({concurrency, spawn, progress})
{
    const running = [];
    return new Promise(function (resolve, reject) {
        const timer = setInterval(tick, 1000);
        schedule();
        if (running.length) {
            tick();
        }
        function schedule() {
            while (running.length < concurrency) {
                const w = spawn();
                if (!w) {
                    break;
                }
                const item = Promise.resolve(w).then(resolved, rejected);
                running.push(item);
                function resolved() {
                    const i = running.indexOf(item);
                    if (i === -1) {
                        throw new NotImplemented();
                    }
                    running.splice(i, 1);
                    schedule();
                }
                function rejected(error) {
                    console.log(error);
                    throw new NotImplemented();
                }
            }
            if (running.length === 0) {
                tick();
                clearInterval(timer);
                resolve();
            }
        }
        function tick() {
            if (progress) {
                progress(running);
            }
        }
    });
}

module.exports = parallel;
