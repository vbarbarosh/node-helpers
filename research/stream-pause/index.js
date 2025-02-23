#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../../src/cli');
const format_progress_bytes = require('../../src/format_progress_bytes');
const make_progress = require('../../src/make_progress');
const object_defaults = require('../../src/object_defaults');
const stream = require('stream');
const stream_discard = require('../../src/stream_discard');

cli(main);

async function main()
{
    const events = {
        pause: () => 0,
        resume: () => 0,
    };

    setInterval(() => events.pause(), 100);
    setInterval(() => events.resume(), 200);

    const rs = stream.Readable.from(gen());
    await stream.promises.pipeline(
        rs,
        stream_pause({events}),
        stream_progress2({
            interval: 100,
            progress: make_progress(),
            tick: function (ctx) {
                ctx.progress.update(ctx.done);
                console.log(format_progress_bytes(ctx.progress));
            },
        }),
        stream_discard()
    );

    console.log('🎉 Done');
}

async function* gen()
{
    for (let i = 0; i < 1E9; ++i) {
        yield Buffer.from([i]);
        if (i % 1E5 === 0) {
            await Promise.delay(1);
        }
    }
}

function stream_pause({objectMode = false, events} = {})
{
    let paused = false;
    let pending = null;
    events.pause = pause;
    events.resume = resume;
    return new stream.PassThrough({
        objectMode,
        write: function (buffer, encoding, callback) {
            this.push(buffer, encoding);
            if (paused) {
                pending = callback;
            }
            else {
                callback();
            }
        },
    });
    function pause() {
        paused = true;
    }
    function resume() {
        paused = false;
        if (pending) {
            const tmp = pending;
            pending = null;
            tmp();
        }
    }
}

function stream_progress2(ctx)
{
    object_defaults(ctx, {objectMode: false, done: 0, interval: 1000});
    const timer = setInterval(tick, ctx.interval);
    setTimeout(tick, 0);
    return new stream.Transform({
        objectMode: ctx.objectMode,
        destroy: function (error, callback) {
            tick();
            clearInterval(timer);
            callback();
        },
        transform: function (buffer, encoding, callback) {
            if (ctx.objectMode) {
                ctx.done++;
                this.push(buffer);
            }
            else {
                ctx.done += buffer.length;
                this.push(buffer, encoding);
            }
            callback();
        },
    });
    function tick() {
        ctx.tick(ctx);
    }
}
