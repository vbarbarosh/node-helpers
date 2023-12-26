const Promise = require('bluebird');
const child_process = require('child_process');
const fs_path_resolve = require('./fs_path_resolve');
const fs_tempdir = require('./fs_tempdir');
const fs_write_json = require('./fs_write_json');
const random_int = require('./random_int');
const redis_zshift = require('./redis_zshift');
const stream_data_ln = require('./stream_data_ln');

/**
 * Constantly monitors redis queue for incoming messages. After an incoming message was hit,
 * dumps it into `request.json` and executes `spawn_command`. The current directory will be set
 * to a new directory with just `request.json` inside. Result (`null`) and user-friendly
 * statuses will be `rpush`ed to the output queue.
 *
 * @param options
 * @returns {Promise<void>}
 *
 *     const options = {
 *         log: logger_create(),
 *         redis: redis_connect2('redis://127.0.0.1'),
 *         redis_input_queue: 'mp4gif_input',
 *         redis_output_queue: 'mp4gif_output',
 *         spawn_command: 'banner-export-mp4gif',
 *         log_waiter_begin: 'mp4gif_waiter_begin',
 *         log_waiter_end: 'mp4gif_waiter_end',
 *         log_waiter_sleep: 'mp4gif_waiter_sleep',
 *         log_waiter_rpush: 'mp4gif_waiter_rpush',
 *         log_waiter_error: 'mp4gif_waiter_error',
 *         log_waiter_error_parse: 'mp4gif_waiter_error_parse',
 *         log_waiter_error_no_uid: 'mp4gif_waiter_error_no_uid',
 *         log_worker_begin: 'mp4gif_worker_begin',
 *         log_worker_end_ok: 'mp4gif_worker_end_ok',
 *         log_worker_end_error: 'mp4gif_worker_end_error',
 *         log_worker_stdout: 'mp4gif_worker_stdout',
 *         log_worker_stderr: 'mp4gif_worker_stderr',
 *         log_worker_user_friendly_status: 'mp4gif_worker_user_friendly_status',
 *     };
 *     await redis_poll_zshift_spawn_rpush(options);
 */
async function redis_poll_zshift_spawn_rpush(options)
{
    const {log, redis, redis_input_queue, redis_output_queue, version} = options;
    const {
        log_waiter_begin,
        log_waiter_end,
        log_waiter_sleep,
        log_waiter_rpush,
        log_waiter_error,
        log_waiter_error_parse,
        log_waiter_error_no_uid,
    } = options;

    log(`[${log_waiter_begin}] v${version}`);
    try {
        for (let iter = 1; iter <= 24*60*60; ++iter) {

            // const message_string = await redis.lpop_p(redis_input_queue);
            const [message_string] = await redis_zshift(redis, redis_input_queue);
            if (!message_string) {
                const ms = random_int(500, 1500);
                log(`[${log_waiter_sleep}] ${ms}ms`);
                await Promise.delay(ms);
                continue;
            }

            let message = null;
            try {
                message = JSON.parse(message_string);
            }
            catch (error) {
                log(`[${log_waiter_error_parse}] ${error.message}`);
                continue;
            }

            try {
                const uid = message.uid;

                if (!uid) {
                    log(`[${log_waiter_error_no_uid}] uid is missed; skipped`);
                    continue;
                }
                if (!message.expires_at) {
                    throw new Error('expires_at is missed');
                }

                // This is necessary because we use signed urls which has limited lifetime.
                // Basically, `expires_at` tell when signed url will be expired.
                if (new Date(message.expires_at).getTime() <= new Date().getTime()) {
                    throw new Error('Expired');
                }

                await worker(log.spawn(), message, options);
                const response = JSON.stringify({uid: message.uid, version, type: 'resolve', value: null});
                await redis.rpush_p(redis_output_queue, response);

                log(`[${log_waiter_rpush}]`);
            }
            catch (error) {
                const response = JSON.stringify({uid: message.uid, version, type: 'error', value: `${(error && (error.stack || error.message)) || 'Error N/A'}`});
                log(`[${log_waiter_error}] ${response}`);
                await redis.rpush_p(redis_output_queue, response);
            }
        }
    }
    finally {
        log(`[${log_waiter_end}]`);
    }
}

async function worker(log, request, options)
{
    const {redis, redis_output_queue, spawn_command, version} = options;
    const {
        log_worker_begin,
        log_worker_end_ok,
        log_worker_end_error,
        log_worker_stdout,
        log_worker_stderr,
        log_worker_user_friendly_status,
    } = options;

    log(`[${log_worker_begin}] ${request.uid}`);

    try {
        const uid = request.uid;
        // GOTCHA
        // Promise won't update its status until at least one request would
        // be taken from the output queue. Pushing generic "Started..." request
        // will tell the promise to refresh its status.
        await redis.rpush_p(redis_output_queue, JSON.stringify({uid, version, type: 'user_friendly_status', value: 'Started...'}));
        await fs_tempdir(async function (d) {
            await fs_write_json(fs_path_resolve(d, 'request.json'), request);
            const proc = child_process.spawn(spawn_command, [], {cwd: d, stdio: ['pipe', 'pipe', 'pipe', 'pipe']});
            let end_stdout = function () {};
            let end_stderr = function () {};
            let end_user_friendly_status = function () {};
            try {
                await new Promise(function (resolve, reject) {
                    proc.once('error', reject);
                    proc.once('exit', code => code ? reject(new Error(`Process terminated with code ${code}`)) : resolve());
                    end_stdout = stream_data_ln(proc.stdout, line => log(`[${log_worker_stdout}] ${line}`));
                    end_stderr = stream_data_ln(proc.stderr, line => log(`[${log_worker_stderr}] ${line}`));
                    end_user_friendly_status = stream_data_ln(proc.stdio[3], function (line) {
                        log(`[${log_worker_user_friendly_status}] ${line}`);
                        redis.rpush_p(redis_output_queue, JSON.stringify({uid, version, type: 'user_friendly_status', value: line}));
                    });
                });
            }
            finally {
                end_stdout();
                end_stderr();
                end_user_friendly_status();
            }
        });
    }
    catch (error) {
        log(`[${log_worker_end_error}] ${error.message}`);
        throw error;
    }
    log(`[${log_worker_end_ok}]`);
}

module.exports = redis_poll_zshift_spawn_rpush;
