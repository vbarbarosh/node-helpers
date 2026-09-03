const assert = require('assert');
const redis_poll_zshift_spawn_rpush = require('./redis_poll_zshift_spawn_rpush');

describe('redis_poll_zshift_spawn_rpush', function () {
    it('should skip valid-JSON non-object entries and keep polling', async function () {
        const valid = {uid: 'u1', expires_at: new Date(Date.now() + 60*1000).toJSON()};
        const redis = make_fake_redis(['null', '"str"', '1', 'true', JSON.stringify(valid)]);
        const log = make_log();

        await assert.rejects(redis_poll_zshift_spawn_rpush({
            ...make_options(),
            log,
            redis,
            spawn_command: 'true',
        }), /STOP/);

        assert.strictEqual(log.lines.filter(v => v.startsWith('[waiter_error_parse]')).length, 4);
        assert.deepStrictEqual(redis.pushed.map(v => v.type), ['user_friendly_status', 'resolve']);
        assert.strictEqual(redis.pushed[1].uid, 'u1');
    });
});

// redis@4-style client backed by an array of entries; exec() throws STOP
// once the queue is drained so the (otherwise endless) poll loop returns.
function make_fake_redis(entries)
{
    const pushed = [];
    return {
        pushed,
        multi() {
            return {
                ZRANGE() { return this; },
                ZREMRANGEBYRANK() { return this; },
                async exec() {
                    if (entries.length === 0) {
                        throw new Error('STOP');
                    }
                    return [[entries.shift()], 1];
                },
            };
        },
        async rPush(queue, value) {
            pushed.push(JSON.parse(value));
            return pushed.length;
        },
    };
}

function make_log(lines = [])
{
    const log = line => lines.push(line);
    log.lines = lines;
    log.spawn = () => make_log(lines);
    return log;
}

function make_options()
{
    return {
        redis_input_queue: 'test_input',
        redis_output_queue: 'test_output',
        version: '1.0.0',
        log_waiter_begin: 'waiter_begin',
        log_waiter_end: 'waiter_end',
        log_waiter_sleep: 'waiter_sleep',
        log_waiter_rpush: 'waiter_rpush',
        log_waiter_error: 'waiter_error',
        log_waiter_error_parse: 'waiter_error_parse',
        log_waiter_error_no_uid: 'waiter_error_no_uid',
        log_worker_begin: 'worker_begin',
        log_worker_end_ok: 'worker_end_ok',
        log_worker_end_error: 'worker_end_error',
        log_worker_stdout: 'worker_stdout',
        log_worker_stderr: 'worker_stderr',
        log_worker_user_friendly_status: 'worker_user_friendly_status',
    };
}
