#!/usr/bin/env node

// ✅ 1. Client that works normally (sends correct PINGs)

const net = require('net');

const SOCKET = process.env.WATCHDOG_SOCKET;
const INTERVAL = Number(process.env.WATCHDOG_INTERVAL || 1000);

if (!SOCKET) throw new Error('WATCHDOG_SOCKET missing');

setInterval(ping, INTERVAL / 2);

function ping()
{
    const socket = net.connect(SOCKET, () => socket.end('PING'));
}
