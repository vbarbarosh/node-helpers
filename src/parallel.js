const NotImplemented = require('./errors/NotImplemented');
const Promise = require('bluebird');
const is_fn_async = require('@vbarbarosh/type-helpers/src/is_fn_async');
const is_fn_gen_async = require('@vbarbarosh/type-helpers/src/is_fn_gen_async');

/**
 * - Run until `spawn` return `null`.
 * - Keep no more than `concurrency` number of workers at a time.
 *
 * ⚠️ Warning: `spawn` should not be async function (async functions are always return `promise`).
 *    Instead, it should be a simple function returning either `null` or a `promise`.
 */
async function parallel({concurrency, spawn, progress})
{
    if (is_fn_async(spawn) || is_fn_gen_async(spawn)) {
        throw new Error('[spawn] should not be async function. Instead, it should be a simple function returning either [null] or a [promise].');
    }
    const running = [];
    return new Promise(function (resolve, reject) {
        let failed = false;
        const timer = setInterval(tick, 1000);
        schedule();
        if (running.length) {
            tick();
        }
        function schedule() {
            while (running.length < concurrency) {
                if (failed) {
                    break;
                }
                let w;
                try {
                    w = spawn();
                }
                catch (error) {
                    // A synchronous throw from spawn must go through fail():
                    // when schedule() runs inside a resolved() handler it
                    // would otherwise become an unhandled rejection and this
                    // promise would never settle (and the timer would leak).
                    fail(error);
                    return;
                }
                if (!w) {
                    break;
                }
                const item = Promise.resolve(w).then(resolved, fail);
                running.push(item);
                function resolved() {
                    if (failed) {
                        return;
                    }
                    const i = running.indexOf(item);
                    if (i === -1) {
                        throw new NotImplemented();
                    }
                    running.splice(i, 1);
                    schedule();
                }
            }
            if (running.length === 0 && !failed) {
                tick();
                clearInterval(timer);
                resolve();
            }
        }
        function fail(error) {
            if (failed) {
                return;
            }
            failed = true;
            running.splice(0, running.length);
            clearInterval(timer);
            reject(error);
        }
        function tick() {
            if (progress) {
                progress(running);
            }
        }
    });
}

module.exports = parallel;
