const assert = require('assert');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Runs the built bundle (npm run build) as a page would, with or without
// axios before it
function load(globals = {})
{
    const logs = [];
    const warnings = [];
    const ctx = vm.createContext({
        URL,
        FormData,
        document: {currentScript: {src: 'https://example.com/browser.js'}},
        console: {log: s => logs.push(s), warn: s => warnings.push(s)},
        ...globals,
    });
    ctx.window = ctx;
    const code = fs.readFileSync(path.resolve(__dirname, '../../dist/browser.js'), 'utf8');
    vm.runInContext(code, ctx);
    return {h: ctx.h, logs, warnings};
}

describe('browser.js', function () {
    it('with axios: every helper, http_* included, no warning', function () {
        const {h, warnings} = load({axios});
        assert.strictEqual(typeof h.http_get_json, 'function');
        assert.strictEqual(typeof h.plural, 'function');
        assert.deepStrictEqual(warnings, []);
    });
    it('without axios: the other helpers, http_* left out, one warning naming them', function () {
        const all = Object.keys(load({axios}).h);
        const {h, warnings} = load();
        const http = all.filter(v => v.startsWith('http_'));
        assert.ok(http.length > 0);
        assert.deepStrictEqual(Object.keys(h), all.filter(v => !v.startsWith('http_')));
        assert.strictEqual(h.plural(21, '# link', '# links'), '21 links');
        assert.strictEqual(warnings.length, 1);
        assert.ok(warnings[0].endsWith(`left out ${http.join(', ')}`), warnings[0]);
    });
});
