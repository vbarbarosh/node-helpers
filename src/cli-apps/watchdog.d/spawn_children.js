#!/usr/bin/env node

// ❌ 6. Client that spawns children
// This tests your process group killing.
// If watchdog does not kill the entire group, the sleeps will remain after watchdog exits.

const {spawn} = require('child_process');

spawn('sleep', ['9999'], {detached: false});
spawn('sleep', ['9999'], {detached: false});

console.log('spawned 2 children');

setInterval(() => {}, 1000);
