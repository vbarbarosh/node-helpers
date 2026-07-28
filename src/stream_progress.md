Monitor the progress of data through a pipe, similar to the UNIX `pv` command.

Requirements:

- should emit the first message as fast as possible
- should always emit 100% message
- destroying the stream with an error preserves that error

- Similar: https://www.npmjs.com/package/progress-stream
