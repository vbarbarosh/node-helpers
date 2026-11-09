const redis = require('redis');

// tcp://127.0.0.1:6379
// tls://redis.example.com:6378?password=xxx
// tls://11.11.11.11:6378?password=xx-xx-xx&ssl[verify_peer]=0&ssl[verify_peer_name]=0
async function redis_connect(url, options = {})
{
    const tmp = new URL(url);
    const password = (tmp.password ? decodeURIComponent(tmp.password) : tmp.searchParams.get('password')) ?? options.password;

    if (url.match(/^tls:/)) {
        // The certificate and the name it was issued for are verified, as
        // node does by default. Only the url itself, or the caller's own
        // socket options, can turn that off.
        const socket = {...tls_options(tmp), ...options.socket, tls: true};
        if (socket.rejectUnauthorized === false) {
            process.emitWarning(`redis_connect: the certificate of ${tmp.host} is not verified`, {code: 'REDIS_CONNECT_TLS_NOT_VERIFIED'});
        }
        const out = redis.createClient({
            ...options,
            url: url.replace(/^tls:/, 'rediss:'),
            password,
            socket,
        });
        await out.connect();
        return out;
    }
    const out = await redis.createClient({
        ...options,
        url: url.replace(/^tcp:/, 'redis:'),
        password,
    });
    await out.connect();
    return out;
}

// The switches php stream contexts use, as redis urls shared with php
// services carry them: ssl[verify_peer]=0 and ssl[verify_peer_name]=0
function tls_options(url)
{
    const out = {};
    if (is_off(url.searchParams.get('ssl[verify_peer]'))) {
        out.rejectUnauthorized = false;
    }
    if (is_off(url.searchParams.get('ssl[verify_peer_name]'))) {
        out.checkServerIdentity = () => undefined;
    }
    return out;
}

function is_off(value)
{
    return value === '0' || value === 'false';
}

module.exports = redis_connect;
