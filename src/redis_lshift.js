async function redis_lshift(redis, queue, limit = 1)
{
    const last = limit - 1;
    const [items] = await redis.multi().lrange(queue, 0, last).ltrim(queue, limit, -1).exec_p();
    return items;
}

export default redis_lshift;
