Wait for a promise/value to settle while calling `ctx.tick(ctx)` every
`ctx.tick_ms` milliseconds (default 1000, first call is immediate). After
`ctx.timeout` milliseconds, reject with a `Timeout` error; without `timeout`
there is no deadline.

**Input:** a single `ctx` object with either `value` (promise or plain value)
or `fn` (called once; sync throws become rejections). `countdown` mutates
`ctx`, exposing `time_begin`, `time_now`, `time_elapsed`, `time_remained`,
and `resolve`/`reject` functions — so `tick` can render progress or settle
the countdown early. A throwing `tick` rejects and stops the timers.

```js
await countdown({
    fn: () => upload(file),
    timeout: 60000,
    tick_ms: 1000,
    tick: ctx => console.log(`${ctx.time_elapsed}ms elapsed`),
});
```

@see user_friendly_status, eta
