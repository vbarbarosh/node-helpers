async function redis_zshift(redis, queue, limit = 1)
{
    const last = limit - 1;
    if (redis.zrange) {
        const [items] = await new Promise(function (resolve, reject) {
            redis.multi().zrange(queue, 0, last).zremrangebyrank(queue, 0, last).exec(function (error, out) {
                error ? reject(error) : resolve(out);
            });
        });
        return items;
    }
    // redis@4
    const [items] = await redis.multi().ZRANGE(queue, 0, last).ZREMRANGEBYRANK(queue, 0, last).exec();
    return items;
}

module.exports = redis_zshift;
