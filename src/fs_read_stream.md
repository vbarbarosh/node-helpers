Thin wrapper over `fs.createReadStream(path, options)`.
Returns a readable stream synchronously (not a Promise); open errors are emitted as `'error'` events on the stream.
