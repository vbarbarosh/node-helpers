#!/usr/bin/env node

// ❌ 10. Client sends heartbeats but with huge delay
// Tests delayed heartbeat behavior.
// Expected: watchdog should kill before that.

const net = require('net');

const INTERVAL = Number(process.env.WATCHDOG_INTERVAL || 1000);

const socket = net.connect(process.env.WATCHDOG_SOCKET, () => {
    console.log('connected');

    setTimeout(() => {
        console.log('sending late heartbeat');
        socket.end('PING');
    }, INTERVAL * 10);
});
