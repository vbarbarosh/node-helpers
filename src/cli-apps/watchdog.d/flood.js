#!/usr/bin/env node

// ❌ 7. Client that floods watchdog with 1GB of data
// Outcome: watchdog must handle MASSIVE reads and still time out.

const fs = require('fs');
const net = require('net');

const socket = net.connect(process.env.WATCHDOG_SOCKET, () => {
    console.log('connected');
    const stream = fs.createReadStream('/dev/zero');
    stream.pipe(socket);
});
