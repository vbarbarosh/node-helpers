// - update progress by delta
// - update progress by replacing total amount
// - render eta
// - render items/second
// - render percents
// - time spent
//
// https://bramcohen.livejournal.com/24122.html
function make_progress(total)
{
    const history = [];
    const time0 = Date.now();
    const out = {
        done: 0,
        total,
        eta: null,
        // `rate` instead of `bps` (bytes per speed) because this function could count any values (e.g.
        // copied bytes over time, or handled jobs over time, or created object over time, etc.)
        rate: null,
        duration: 0,
        progress: null,
        percents: null,
        add: function (delta = 0) {
            const now = Date.now();
            // The oldest sample is the anchor the rate is measured from, so
            // the newest sample older than 10s is kept: the window then
            // stays close to 10s instead of shrinking after each eviction
            const expired = history.findLastIndex(v => v.time < now - 10000);
            if (expired > 0) {
                history.splice(0, expired);
            }
            out.done += delta;
            history.push({time: now, done: out.done});
            out.refresh();
        },
        update: function (done) {
            out.add(done - out.done);
        },
        refresh: function () {
            out.duration = (Date.now() - time0)/1000;
            // `rate` and `eta` are null while unknown: a single sample says
            // nothing about how long its delta took to accumulate (counting
            // it doubled the rate early on), a zero time window would give
            // rate = Infinity, and a zero rate would give eta = Infinity.
            if (history.length > 1) {
                const delta = out.done - history[0].done;
                const time_sec = (Date.now() - history[0].time)/1000;
                out.rate = time_sec ? delta/time_sec : null;
            }
            else {
                out.rate = null;
            }
            out.percents = !out.total ? null : out.done/out.total;
            out.eta = (!out.total || !out.rate) ? null : (out.total - out.done)/out.rate;
        },
    };
    return out;
}

module.exports = make_progress;
