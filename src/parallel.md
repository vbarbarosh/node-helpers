- Run until `spawn` return `null`.
- Keep no more than `concurrency` number of workers at a time.

⚠️ Warning: `spawn` should not be async function (async functions are always return `promise`).
Instead, it should be a simple function returning either `null` or a `promise`.
