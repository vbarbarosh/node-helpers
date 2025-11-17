#!/usr/bin/env node

// ❌ 11. Client sends heartbeats sporadically (sometimes missing)
// Simulates flaky client.

const net = require('net');

const SOCKET = process.env.WATCHDOG_SOCKET;
if (!SOCKET) throw new Error('WATCHDOG_SOCKET missing');

setInterval(ping, 1000);

function ping()
{
    // Connect → immediately destroy the socket → NO write events
    const socket = net.connect(SOCKET, () => {
        if (Math.random() > 0.5) {
            socket.end('PING');
        }
        else {
            console.log('connected (no ping), closing immediately');
            socket.destroy(); // IMPORTANT: destroy() does not flush anything
        }
    });
}
