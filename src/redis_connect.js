const redis = require('redis');

// tcp://127.0.0.1:6379
// tls://11.11.11.11:6378?password=xxx
// tls://11.11.11.11:6378?password=xx-xx-xx&ssl[verify_peer]=0&ssl[verify_peer_name]=0
async function redis_connect(url)
{
    const tmp = new URL(url);
    const password = tmp.password || tmp.searchParams.get('password');

    if (url.match(/^tls:/)) {
        const out = redis.createClient({
            url: url.replace(/^tls:/, 'rediss:'),
            password,
            tls: {rejectUnauthorized: false},
            socket: {tls: true, rejectUnauthorized: false},
        });
        await out.connect();
        return out;
    }
    const out = await redis.createClient({
        url: url.replace(/^tcp:/, 'redis:'),
        password,
    });
    await out.connect();
    return out;
}

module.exports = redis_connect;
