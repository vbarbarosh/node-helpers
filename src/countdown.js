/**
 * Wait for a promise/value to be settled. Meanwhile, call `tick` function every `tick_ms` milliseconds.
 * After `timeout` seconds, reject with 'Timeout' error.
 *
 * @see user_friendly_status
 * @see progress
 */
function countdown(ctx)
{
    let done = false;
    let timer = null;
    return new Promise(function (resolve, reject) {
        ctx.value = Promise.resolve(ctx.value);
        ctx.timeout = ctx.timeout || 0;
        ctx.time_now = new Date();
        ctx.time_begin = new Date();
        ctx.time_end = Date.now() + ctx.timeout;
        ctx.tick_ms = ctx.tick_ms || 1000;
        ctx.tick = ctx.tick || function () {};
        ctx.resolve = function (value) {
            if (done) {
                throw new Error('Already settled');
            }
            done = true;
            clearInterval(timer);
            resolve(value);
        };
        ctx.reject = function (error) {
            if (done) {
                throw new Error('Already settled');
            }
            done = true;
            clearInterval(timer);
            reject(error);
        };
        timer = setInterval(tick, ctx.tick_ms);
        ctx.value.then(ctx.resolve, ctx.reject);
        tick();
        function tick() {
            ctx.time_now = Date.now();
            ctx.time_elapsed = ctx.time_now - ctx.time_begin;
            ctx.time_remained = Math.max(0, ctx.time_end - ctx.time_now);
            ctx.tick(ctx);
            if (!ctx.time_remained) {
                ctx.reject(new Error('Timeout'));
            }
        }
    });
}

module.exports = countdown;
