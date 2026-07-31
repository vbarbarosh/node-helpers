async function redis_rpush(redis, queue, value)
{
    if (redis.rpush) {
        return new Promise(function (resolve, reject) {
            redis.rpush(queue, value, function (error, out) {
                error ? reject(error) : resolve(out);
            });
        });
    }
    // redis@4
    return redis.rPush(queue, value);
}

module.exports = redis_rpush;
