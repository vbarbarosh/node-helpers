const Redis = require('redis');

/**
 * tls://11.11.11.11:6378?ip-google=11.11.11.11&ip-external=22.22.22.22&password=xx-xx-xx&ssl[verify_peer]=0&ssl[verify_peer_name]=0
 *
 * @param url
 * @returns {*}
 */
function redis_connect(url)
{
    if (url.match(/^tls:/)) {
        return Redis.createClient(url.replace(/^tls:/, 'rediss:'), {
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    return Redis.createClient(url.replace(/^tcp:/, 'redis:'));
}

module.exports = redis_connect;
