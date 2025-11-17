#!/usr/bin/env node

// 1️⃣ Client that ignores SIGTERM
// Goal: process stays alive after SIGTERM and only dies on SIGKILL (exactly what pid_kill_grace should handle).
//
// What this tests for watchdog:
//   - watchdog sends SIGTERM → process prints “ignored” and keeps running.
//   - pid_kill_grace waits grace_timeout_ms, sees PID still alive, sends SIGKILL.
//   - Process must die after SIGKILL.
//   - Watchdog should log the whole sequence correctly.
// This is a realistic scenario.

console.log('PID:', process.pid);

// Ignore SIGTERM
process.on('SIGTERM', function () {
    console.log('SIGTERM received, but intentionally ignored');
});

// Still react to SIGINT (Ctrl+C) so you can stop it manually if needed
process.on('SIGINT', function () {
    console.log('SIGINT received, exiting');
    process.exit(130);
});

// Keep process alive
setInterval(() => {
    // simulate work
}, 1000);
