/**
 * Ensure that only one event was fired for each ms.
 *
 * @link https://stackoverflow.com/questions/25991367/difference-between-throttling-and-debouncing-a-function
 */
function throttle(ms, fn)
{
    let timer = null;
    let last_value = undefined;
    run.fire = fire;
    return run;
    function run(value) {
        last_value = value;
        if (timer === null) {
            timer = setTimeout(fire, ms)
        }
    }
    function fire() {
        if (timer === null) {
            return;
        }
        clearTimeout(timer);
        timer = null;
        const tmp = last_value;
        last_value = undefined;
        return fn(tmp);
    }
}

module.exports = throttle;
