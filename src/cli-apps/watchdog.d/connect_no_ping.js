#!/usr/bin/env node

// ❌ 8. Client connects but NEVER sends PING
// Simulates misbehaving client.

const net = require('net');

net.connect(process.env.WATCHDOG_SOCKET, () => {
    console.log('connected but no ping');
    // do nothing
});

setInterval(() => {}, 1000);
