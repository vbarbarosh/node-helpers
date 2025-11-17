#!/usr/bin/env node

// 9. Client that connects but sends absolutely NO DATA.
// Watchdog must NOT treat this as a PING.

const net = require('net');

const SOCKET = process.env.WATCHDOG_SOCKET;
if (!SOCKET) throw new Error('WATCHDOG_SOCKET missing');

// Connect → immediately destroy the socket → NO write events
const socket = net.connect(SOCKET, () => {
    console.log('connected (no ping), closing immediately');
    socket.destroy(); // IMPORTANT: destroy() does not flush anything
});

setInterval(() => {}, 1000);
