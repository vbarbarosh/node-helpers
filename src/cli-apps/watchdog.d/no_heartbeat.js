#!/usr/bin/env node

// ❌ 2. Client that never sends heartbeat (expected: watchdog kills it)

setInterval(() => {}, 1000); // alive but no PINGs
