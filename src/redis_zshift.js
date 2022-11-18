async function redis_zshift(redis, queue, limit = 1)
{
    const last = limit - 1;
    // noinspection JSUnresolvedFunction
    const [items] = await redis.multi().zrange(queue, 0, last).zremrangebyrank(queue, 0, last).exec_p();
    return items;
}

module.exports = redis_zshift;
