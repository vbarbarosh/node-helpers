const assert = require('assert');
const redis_zshift = require('./redis_zshift');

const REDIS_HOST = '127.0.0.1';
const REDIS_PORT = 6379;
const REDIS_AUTH = null;
const REDIS_QUEUE = 'TESTING';

describe('redis_zshift', function () {
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
            const args = [REDIS_QUEUE, ...expected.map((v,i) => [i,v]).flat()];
            r.zadd(args, (e,v) => e ? reject(e) : resolve(v));
        });
        const actual = await redis_zshift(r, REDIS_QUEUE, expected.length);
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
        await r.ZADD(REDIS_QUEUE, expected.map((value,i) => ({score: i, value})));
        const actual = await redis_zshift(r, REDIS_QUEUE, 5);
        await assert.deepStrictEqual(actual, expected);
    }
    finally {
        await r.quit();
    }
}
