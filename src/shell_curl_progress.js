const Promise = require('bluebird');
const child_process = require('child_process');
const stream = require('stream');
const stream_curl_progress = require('./stream_curl_progress');
const stream_each = require('./stream_each');

async function shell_curl_progress(args, {options, user_friendly_status})
{
    // $ man curl
    // > If you want a progress meter for HTTP POST or PUT requests,
    // > you need to redirect the response output to a file, using
    // > shell redirect (>), -o, --output or similar.

    const tmp = ['--no-silent', '--progress-meter'];
    if (!args.includes('-o')) {
        tmp.push('-o', '/dev/null');
    }
    const proc = child_process.spawn(args[0], args.slice(1).concat(tmp), {...options, stdio: ['inherit', 'inherit', 'pipe']});

    const promises = [];
    promises.push(new Promise(function (resolve, reject) {
        proc.once('error', reject);
        proc.once('exit', code => code ? reject(new Error(`Process terminated with code ${code}`)) : resolve());
    }));
    promises.push(stream.promises.pipeline(proc.stderr, stream_curl_progress(), stream_each(progress_fn)));

    await Promise.all(promises);

    function progress_fn(v) {
        const speed = v.speed === '0' ? '~' : `${v.speed}/s`;
        user_friendly_status(`${v.perc}% | ${v.done} of ${v.total} at ${speed} ETA ${v.eta} duration=${v.duration}`);
    }
}

module.exports = shell_curl_progress;
