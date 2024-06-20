const stream = require('stream');
const stream_lines = require('./stream_lines');
const stream_map = require('./stream_map');
const stream_skip = require('./stream_skip');

function stream_curl_progress()
{
    return stream.compose(
        stream_lines(),
        stream_skip(2),
        stream_map(function (v) {
            // % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
            //                                Dload  Upload   Total   Spent    Left  Speed
            // 0 3217M    0     0    0  128k      0   205k  4:27:16 --:--:--  4:27:16  205k
            // 0 3217M    0     0    0 6016k      0  3751k  0:14:38  0:00:01  0:14:37 3750k
            // ...
            // 18 3217M    0     0   18  587M      0  18.5M  0:02:53  0:00:31  0:02:22 19.0M
            const [perc, total, perc2, recv, perc3, transferred, speed_down, speed_up, time_total, duration, eta, speed] = v.trim().split(/\s+/);
            return {
                perc,
                total,
                perc2,
                recv,
                perc3,
                transferred,
                speed_down,
                speed_up,
                time_total: time_total === '--:--:--' ? '~' : time_total,
                duration: duration === '--:--:--' ? '~' : duration,
                eta: eta === '--:--:--' ? '~' : eta,
                speed
            };
        }),
    );
}

module.exports = stream_curl_progress;
