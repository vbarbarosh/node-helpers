// - update progress by delta
// - update progress by replacing total amount
// - render eta
// - render items/second
// - render percentage
// - time spent
//
// https://bramcohen.livejournal.com/24122.html
function progress(total)
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
        percentage: null,
        add: function (delta = 0) {
            const now_minus_2sec = Date.now() - 2000;
            history.push({time: Date.now(), delta});
            // Keep last 2 seconds
            history.splice(0, history.findLastIndex(v => v.time < now_minus_2sec));
            out.done += delta;
            out.refresh();
        },
        update: function (done) {
            out.add(done - out.done);
        },
        refresh: function () {
            const now_minus_2sec = Date.now() - 2000;
            const tmp = history.filter(v => v.time >= now_minus_2sec);
            if (tmp.length > 1) {
                const items = tmp.reduce((a,v) => a + v.delta, 0);
                const time_sec = (tmp.pop().time - tmp[0].time)/1000;
                out.rate = items/time_sec;
            }
            else {
                out.rate = out.done/out.duration;
            }
            out.duration = (Date.now() - time0)/1000;
            out.percentage = !out.total ? null : out.done/out.total;
            out.eta = !out.total ? null : (out.total - out.done)/out.rate;
        },
    };
    return out;
}

module.exports = progress;
