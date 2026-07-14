const Promise = require('bluebird');

/**
 * Wait for a promise/value to be settled. Meanwhile, call `tick` function every `tick_ms` milliseconds.
 * After `timeout` milliseconds, reject with 'Timeout' error.
 *
 * @see user_friendly_status
 * @see progress
 */
function countdown(ctx)
{
    let done = false;
    let timer = null;
    let timeout_timer = null;
    return new Promise(function (resolve, reject) {
        ctx.value = ctx.fn ? Promise.method(ctx.fn).call() : Promise.resolve(ctx.value);
        ctx.timeout = ctx.timeout || 0; // ⚠️ Rename to timeout_ms
        ctx.time_now = new Date();
        ctx.time_begin = new Date();
        // No timeout means no deadline
        ctx.time_end = ctx.timeout ? Date.now() + ctx.timeout : Infinity;
        ctx.tick_ms = ctx.tick_ms || 1000;
        ctx.tick = ctx.tick || function () {};
        ctx.resolve = function (value) {
            if (done) {
                return;
            }
            done = true;
            clearInterval(timer);
            clearTimeout(timeout_timer);
            resolve(value);
        };
        ctx.reject = function (error) {
            if (done) {
                return;
            }
            done = true;
            clearInterval(timer);
            clearTimeout(timeout_timer);
            reject(error);
        };
        timer = setInterval(tick, ctx.tick_ms);
        if (ctx.timeout) {
            // The interval alone enforces the deadline only at tick_ms granularity
            timeout_timer = setTimeout(tick, ctx.timeout);
        }
        ctx.value.then(ctx.resolve, ctx.reject);
        tick();
        function tick() {
            ctx.time_now = Date.now();
            ctx.time_elapsed = ctx.time_now - ctx.time_begin;
            ctx.time_remained = Math.max(0, ctx.time_end - ctx.time_now);
            try {
                ctx.tick(ctx);
            }
            catch (error) {
                // A throwing tick must reject and clear the timers: a bare
                // throw inside setInterval is an uncaughtException, and the
                // interval would keep firing (and throwing) forever.
                ctx.reject(error);
                return;
            }
            if (!ctx.time_remained) {
                ctx.reject(new Error('Timeout'));
            }
        }
    });
}

module.exports = countdown;
