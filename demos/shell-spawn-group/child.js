#!/usr/bin/env node

const {spawn} = require('child_process');

spawn('sleep', ['9999'], {detached: false});
spawn('sleep', ['9999'], {detached: false});

console.log('spawned 2 children');

setInterval(() => {}, 1000);
