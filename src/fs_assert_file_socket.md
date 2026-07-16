Asserts that `file` is a Unix domain socket.
Rejects with `Not a socket: <file>` for any other entry type, and with `ENOENT` if the path is missing.
