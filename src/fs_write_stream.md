Thin wrapper over `fs.createWriteStream(path, options)`.
Returns a writable stream synchronously (not a Promise); open errors are emitted as `'error'` events on the stream.
