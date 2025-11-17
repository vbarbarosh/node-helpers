#!/usr/bin/env node

// ❌ 11. Client sends heartbeats sporadically (sometimes missing)
// Simulates flaky client.

const net = require('net');

function randomDelay() {
    return Math.floor(Math.random() * 5000);
}

setTimeout(ping, randomDelay());

function ping()
{
    const socket = net.connect(process.env.WATCHDOG_SOCKET);
    socket.on('connect', () => {
        socket.end('PING');
        setTimeout(ping, randomDelay());
    });
}
