#!/usr/bin/env node

// Opens docs/index.html in a headless Chrome and checks which Axios the page
// ends up running. bin/check-cdn-dependencies.js reads the HTML source only;
// a script the page loads may add tags of its own, and the last one wins.

const child_process = require('child_process');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const fs = require('fs');
const fs_tempdir = require('@vbarbarosh/node-helpers/src/fs_tempdir');
const http = require('http');
const path = require('path');
const pkg = require('../package.json');

const TIMEOUT_MS = 90000;
const CONTENT_TYPES = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
};

cli(main);

async function main()
{
    const expected = pkg.dependencies.axios;
    const chrome = find_chrome();
    const server = await serve(path.resolve(__dirname, '../docs'));
    try {
        const found = await fs_tempdir(function (profile) {
            return read_page(chrome, profile, `http://127.0.0.1:${server.address().port}/`);
        });
        const others = [...new Set([...found.tags, ...found.requested])].filter(v => v !== expected);
        if (!found.ready) {
            throw new Error(`docs/index.html did not finish loading in ${TIMEOUT_MS / 1000} seconds; axios.VERSION was ${JSON.stringify(found.version)}`);
        }
        if (found.version !== expected) {
            throw new Error(`docs/index.html runs Axios ${JSON.stringify(found.version)}; expected ${expected}`);
        }
        if (others.length) {
            throw new Error(`docs/index.html also loads Axios ${others.join(', ')}; expected ${expected} only`);
        }
        if (!found.tags.length) {
            throw new Error('docs/index.html has no versioned Axios script tag');
        }
        console.log(`The docs page runs Axios ${found.version} and loads no other: ${found.tags.length} script tags, ${found.helpers} entries listed`);
    }
    finally {
        server.closeAllConnections();
        server.close();
    }
}

function find_chrome()
{
    const names = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
    const dirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
    const candidates = [process.env.CHROME_BIN, ...names.flatMap(name => dirs.map(dir => path.join(dir, name)))];
    const out = candidates.find(v => v && fs.existsSync(v));
    if (!out) {
        throw new Error(`No Chrome found: set CHROME_BIN, or put one of ${names.join(', ')} on PATH`);
    }
    return out;
}

function serve(root)
{
    const server = http.createServer(function (req, res) {
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        const file = path.join(root, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
        if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {'Content-Type': CONTENT_TYPES[path.extname(file)] || 'application/octet-stream'});
        fs.createReadStream(file).pipe(res);
    });
    return new Promise(function (resolve, reject) {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => resolve(server));
    });
}

// Drives Chrome over the DevTools protocol, with Node's own WebSocket client
async function read_page(chrome, profile, url)
{
    const proc = child_process.spawn(chrome, [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--remote-debugging-port=0',
        `--user-data-dir=${profile}`,
        'about:blank',
    ], {stdio: ['ignore', 'ignore', 'pipe']});
    const exited = new Promise(resolve => proc.once('exit', resolve));
    let ws = null;
    try {
        ws = await connect(await devtools_url(proc));
        const requested = [];
        const send = protocol(ws, function (message) {
            const m = message.method === 'Network.requestWillBeSent' && message.params.request.url.match(/\/axios@([^/]+)\/dist\/axios(?:\.min)?\.js/);
            if (m) {
                requested.push(m[1]);
            }
        });
        const {targetId} = await send('Target.createTarget', {url: 'about:blank'});
        const {sessionId} = await send('Target.attachToTarget', {targetId, flatten: true});
        await send('Network.enable', {}, sessionId);
        await send('Page.navigate', {url}, sessionId);

        // The list of helpers is drawn once every script has loaded and the
        // page has fetched data.json with the Axios it ended up with
        const expression = `JSON.stringify({
            version: typeof axios === 'undefined' ? null : axios.VERSION,
            tags: [...document.scripts].map(v => v.src.match(/\\/axios@([^/]+)\\/dist\\/axios(?:\\.min)?\\.js/)).filter(Boolean).map(m => m[1]),
            helpers: document.querySelectorAll('aside li').length,
        })`;
        const deadline = Date.now() + TIMEOUT_MS;
        let found = {version: null, tags: [], helpers: 0};
        while (!found.helpers && Date.now() < deadline) {
            await new Promise(resolve => setTimeout(resolve, 250));
            const {result} = await send('Runtime.evaluate', {expression, returnByValue: true}, sessionId);
            found = JSON.parse(result.value);
        }
        return {...found, ready: found.helpers > 0, requested};
    }
    finally {
        ws?.close();
        proc.kill('SIGKILL');
        await exited;
    }
}

function devtools_url(proc)
{
    return new Promise(function (resolve, reject) {
        let stderr = '';
        const timer = setTimeout(() => reject(new Error(`Chrome did not open its DevTools port: ${stderr.trim()}`)), 30000);
        proc.once('error', done);
        proc.once('exit', code => done(new Error(`Chrome exited with code ${code}: ${stderr.trim()}`)));
        proc.stderr.on('data', function (chunk) {
            stderr += chunk;
            const m = stderr.match(/DevTools listening on (ws:\/\/\S+)/);
            if (m) {
                done(null, m[1]);
            }
        });
        function done(error, value) {
            clearTimeout(timer);
            error ? reject(error) : resolve(value);
        }
    });
}

function connect(url)
{
    return new Promise(function (resolve, reject) {
        const ws = new WebSocket(url);
        ws.addEventListener('open', () => resolve(ws));
        ws.addEventListener('error', () => reject(new Error(`Cannot connect to Chrome at ${url}`)));
    });
}

function protocol(ws, on_event)
{
    const pending = new Map();
    let next_id = 0;
    ws.addEventListener('message', function (event) {
        const message = JSON.parse(event.data);
        if (!message.id) {
            on_event(message);
            return;
        }
        const {resolve, reject} = pending.get(message.id);
        pending.delete(message.id);
        message.error ? reject(new Error(`${message.error.message} (${message.error.code})`)) : resolve(message.result);
    });
    ws.addEventListener('close', function () {
        pending.forEach(v => v.reject(new Error('Chrome closed the DevTools connection')));
        pending.clear();
    });
    return function (method, params = {}, sessionId = undefined) {
        return new Promise(function (resolve, reject) {
            const id = ++next_id;
            pending.set(id, {resolve, reject});
            ws.send(JSON.stringify({id, method, params, sessionId}));
        });
    };
}
