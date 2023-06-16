async function redis_lshift(redis, queue, limit = 1)
{
    const last = limit - 1;
    if (redis.lrange) {
        const [items] = await redis.multi().lrange(queue, 0, last).ltrim(queue, limit, -1).exec_p();
        return items;
    }
    // redis@4
    const [items] = await redis.multi().LRANGE(queue, 0, last).LTRIM(queue, limit, -1).exec();
    return items;
}

module.exports = redis_lshift;
