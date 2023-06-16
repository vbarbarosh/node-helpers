const assert = require('assert');
const redis_lshift = require('./redis_lshift');

const REDIS_HOST = '127.0.0.1';
const REDIS_PORT = 6379;
const REDIS_AUTH = null;
const REDIS_QUEUE = 'TESTING';

describe('redis_lshift', function () {
    it('should work with redis@1', async function () {
        await test_1_2_3(require('redis-v1'));
    });
    it('should work with redis@2', async function () {
        await test_1_2_3(require('redis-v2'));
    });
    it('should work with redis@3', async function () {
        await test_1_2_3(require('redis-v3'));
    });
    it('should work with redis@4', async function () {
        await test_4(require('redis-v4'));
    });
});

async function test_1_2_3(redis)
{
    const r = redis.createClient(REDIS_PORT, REDIS_HOST, {password: REDIS_AUTH || undefined});
    try {
        const expected = 'aa,bb,cc,dd,ee'.split(',');
        await new Promise(function (resolve, reject) {
            r.del(REDIS_QUEUE, (e,v) => e ? reject(e) : resolve(v));
        });
        await new Promise(function (resolve, reject) {
            r.rpush(REDIS_QUEUE, ...expected, (e,v) => e ? reject(e) : resolve(v));
        });
        const actual = await redis_lshift(r, REDIS_QUEUE, expected.length);
        await assert.deepStrictEqual(actual, expected);
    }
    finally {
        await r.quit();
    }
}

async function test_4(redis)
{
    const r = redis.createClient(REDIS_PORT, REDIS_HOST, {password: REDIS_AUTH || undefined});
    await r.connect();
    try {
        const expected = 'aa,bb,cc,dd,ee'.split(',');
        await r.DEL(REDIS_QUEUE);
        await r.RPUSH(REDIS_QUEUE, expected);
        const actual = await redis_lshift(r, REDIS_QUEUE, expected.length);
        await assert.deepStrictEqual(actual, expected);
    }
    finally {
        await r.quit();
    }
}
