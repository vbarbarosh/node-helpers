import Promise from 'bluebird';
import random_int from './random_int';
import redis_zshift from './redis_zshift';

async function redis_poll(options)
{
    const {log, version} = options;
    const {
        poll_message,
        push_response,
        process_message,
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
            const message = await poll_message();
            if (!message) {
                const ms = random_int(500, 1500);
                log(`[${log_waiter_sleep}] ${ms}ms`);
                await Promise.delay(ms);
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

                const value = await worker(log.spawn(), message, options);
                await push_response({uid: message.uid, version, type: 'resolve', value});

                log(`[${log_waiter_rpush}]`);
            }
            catch (error) {
                const response = {uid: message.uid, version, type: 'reject', value: `${(error && (error.stack || error.message)) || 'Error N/A'}`};
                log(`[${log_waiter_error}] ${JSON.stringify({response})}`);
                await push_response(response);
            }
        }
    }
    finally {
        log(`[${log_waiter_end}]`);
    }
}

async function worker(log, message, options)
{
    const {redis, redis_output_queue, spawn_command, version} = options;
    const {
        callback,
        log_worker_begin,
        log_worker_end_ok,
        log_worker_end_error,
        log_worker_stdout,
        log_worker_stderr,
        log_worker_user_friendly_status,
    } = options;

    log(`[${log_worker_begin}] ${message.uid}`);

    const uid = message.uid;

    try {
        // GOTCHA
        // Promise won't update its status until at least one message would
        // be taken from output queue. Pushing generic "Started...." message
        // will tell the promise to refresh its status.
        await user_friendly_status('Started...');
        const out = await callback({message, log: log.spawn(), user_friendly_status});
        log(`[${log_worker_end_ok}]`);
        return out;
    }
    catch (error) {
        log(`[${log_worker_end_error}] ${error.message}`);
        throw error;
    }

    async function user_friendly_status(value) {
        log(`[${log_worker_user_friendly_status}] ${value}`);
        await redis.rpush_p(redis_output_queue, JSON.stringify({uid, version, type: 'user_friendly_status', value}));
    }
}

export default redis_poll;
