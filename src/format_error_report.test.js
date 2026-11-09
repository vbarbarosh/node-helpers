const assert = require('assert');
const format_error_report = require('./format_error_report');

describe('format_error_report', function () {
    it('should report falsy errors as JSON', function () {
        assert.strictEqual(format_error_report(null), '{"error":null}');
        assert.strictEqual(format_error_report(undefined), '{"error":"---undefined---"}');
    });
    it('should report plain errors as JSON', function () {
        const out = JSON.parse(format_error_report(Object.assign(new Error('boom'), {code: 'E_BOOM'})));
        assert.strictEqual(out.code, 'E_BOOM');
        assert.strictEqual(out.name, 'Error');
        assert.strictEqual(out.message, 'boom');
        assert.ok(Array.isArray(out.stack));
    });
    it('should mask sensitive headers case-insensitively', function () {
        const error = {
            message: 'failed',
            config: {
                method: 'get',
                url: 'https://example.invalid/api',
                headers: {
                    Authorization: 'Bearer TOP_SECRET',
                    'PROXY-AUTHORIZATION': 'Basic PROXY_SECRET',
                    Cookie: 'sid=COOKIE_SECRET',
                    'set-cookie': ['a=SET_SECRET'],
                    'x-Api-Key': 'APIKEY_SECRET',
                    'API-KEY': 'APIKEY_SECRET2',
                    'X-AUTH-TOKEN': 'AUTHTOKEN_SECRET',
                    'Content-Type': 'application/json',
                    Accept: 'text/plain',
                },
            },
            stack: 'stack',
        };
        const out = format_error_report(error);
        assert.ok(!/SECRET/.test(out), out);
        assert.ok(out.includes('"Authorization": "***"'), out);
        assert.ok(out.includes('"PROXY-AUTHORIZATION": "***"'), out);
        assert.ok(out.includes('"Cookie": "***"'), out);
        assert.ok(out.includes('"set-cookie": "***"'), out);
        assert.ok(out.includes('"x-Api-Key": "***"'), out);
        assert.ok(out.includes('"API-KEY": "***"'), out);
        assert.ok(out.includes('"X-AUTH-TOKEN": "***"'), out);
        assert.ok(out.includes('"Content-Type": "application/json"'), out);
        assert.ok(out.includes('"Accept": "text/plain"'), out);
        assert.ok(out.includes('GET https://example.invalid/api'), out);
        // the input is not mutated
        assert.strictEqual(error.config.headers.Authorization, 'Bearer TOP_SECRET');
    });
    it('should mask headers nested per method (axios style)', function () {
        const error = {
            message: 'failed',
            config: {
                method: 'post',
                url: 'https://example.invalid/api',
                headers: {
                    common: {Accept: 'application/json', AUTHORIZATION: 'Bearer COMMON_SECRET'},
                    post: {'Content-Type': 'application/json', 'X-API-Key': 'POST_SECRET'},
                    cookie: 'sid=TOP_SECRET',
                },
            },
            stack: 'stack',
        };
        const out = format_error_report(error);
        assert.ok(!/SECRET/.test(out), out);
        assert.ok(out.includes('"AUTHORIZATION": "***"'), out);
        assert.ok(out.includes('"X-API-Key": "***"'), out);
        assert.ok(out.includes('"cookie": "***"'), out);
        assert.ok(out.includes('"Accept": "application/json"'), out);
        assert.ok(out.includes('"Content-Type": "application/json"'), out);
    });
    it('should mask headers exposed through toJSON (AxiosHeaders)', function () {
        const headers = {toJSON: () => ({Authorization: 'Bearer TOP_SECRET', Accept: '*/*'})};
        const out = format_error_report({message: 'failed', config: {method: 'get', url: '/x', headers}, stack: 'stack'});
        assert.ok(!/TOP_SECRET/.test(out), out);
        assert.ok(out.includes('"Authorization": "***"'), out);
        assert.ok(out.includes('"Accept": "*/*"'), out);
    });
    it('should mask URL userinfo and sensitive query parameters', function () {
        const url = 'https://user:PASS_SECRET@example.invalid/p?token=T_SECRET&client_id=42&X-Api-Key=K_SECRET&access_token=A_SECRET&password=P_SECRET&sig=S_SECRET&auth=AU_SECRET&page=2#frag';
        const out = format_error_report({message: 'failed', config: {method: 'get', url, headers: {}}, stack: 'stack'});
        assert.ok(!/SECRET/.test(out), out);
        assert.ok(out.includes('GET https://***@example.invalid/p?token=***&client_id=42&X-Api-Key=***&access_token=***&password=***&sig=***&auth=***&page=2#frag'), out);
    });
    it('should mask query parameters whose name segments look secret', function () {
        const names = ['apiKey', 'api_key', 'api-key', 'api.key', 'apikey', 'APIKEY', 'accessToken', 'access_token', 'accesstoken',
            'x-auth-token', 'X-Auth-Token', 'AUTHORIZATION', 'client_secret', 'clientSecret', 'pass', 'passwd', 'pwd', 'password',
            'signature', 'sig', 'key', 'token', 'auth', 'secret', 'user.password', 'oauth_token', 'sort_key_word', 'sig%5Fv2'];
        names.forEach(function (name) {
            const out = format_error_report({message: 'failed', config: {method: 'get', url: `/x?${name}=S_SECRET&page=2`, headers: {}}, stack: 'stack'});
            assert.ok(out.includes(`GET /x?${name}=***&page=2`), `${name}: ${out}`);
        });
    });
    it('should not mask ordinary names that merely contain a secret-looking word', function () {
        const names = ['keyword', 'keyboard', 'design', 'author', 'authors', 'signal', 'monkey', 'passport', 'tokenizer',
            'secretary', 'client_id', 'page', 'q', 'passphrase_hint'];
        names.forEach(function (name) {
            const out = format_error_report({message: 'failed', config: {method: 'get', url: `/x?${name}=visible&page=2`, headers: {}}, stack: 'stack'});
            assert.ok(out.includes(`GET /x?${name}=visible&page=2`), `${name}: ${out}`);
        });
    });
    it('should mask relative URLs and leave URLs without secrets untouched', function () {
        const a = format_error_report({message: 'failed', config: {method: 'get', url: '/api/items?secret=S_SECRET&q=hello', headers: {}}, stack: 'stack'});
        assert.ok(a.includes('GET /api/items?secret=***&q=hello'), a);
        const b = format_error_report({message: 'failed', config: {method: 'get', url: 'https://example.invalid/a/b?q=hello&page=2', headers: {}}, stack: 'stack'});
        assert.ok(b.includes('GET https://example.invalid/a/b?q=hello&page=2'), b);
    });
    it('should mask credential headers by their name, whatever the vendor', function () {
        const names = ['X-Goog-Api-Key', 'Private-Token', 'X-Access-Token', 'X-Amz-Security-Token', 'X-CSRF-Token', 'X-XSRF-TOKEN',
            'apikey', 'CF-Access-Client-Secret', 'X-Vault-Token', 'Ocp-Apim-Subscription-Key', 'DD-API-KEY', 'X-Auth-Key',
            'X-Shopify-Access-Token', 'X-Session-Token', 'Token', 'X-Hub-Signature', 'Authorization'];
        const headers = Object.fromEntries(names.map(v => [v, 'H_SECRET']));
        const out = format_error_report({message: 'failed', config: {method: 'get', url: '/x', headers: {...headers, Accept: 'text/plain', 'Keep-Alive': 'timeout=5'}}, stack: 'stack'});
        assert.ok(!/SECRET/.test(out), out);
        assert.ok(out.includes('"Accept": "text/plain"'), out);
        assert.ok(out.includes('"Keep-Alive": "timeout=5"'), out);
    });
    it('should mask userinfo up to the last "@", also in a scheme-relative URL', function () {
        const a = format_error_report({message: 'failed', config: {method: 'get', url: 'https://admin:P@ss_SECRET@db.example.invalid/x', headers: {}}, stack: 'stack'});
        assert.ok(a.includes('GET https://***@db.example.invalid/x'), a);
        const b = format_error_report({message: 'failed', config: {method: 'get', url: '//admin:PASS2_SECRET@db.example.invalid/x', headers: {}}, stack: 'stack'});
        assert.ok(b.includes('GET //***@db.example.invalid/x'), b);
    });
    it('should mask query names written without separators, in the plural or with a number', function () {
        const names = ['authtoken', 'AUTHTOKEN', 'APIToken', 'accesskey', 'ACCESSKEY', 'secretkey', 'SECRETKEY', 'apisecret', 'clientsecret',
            'CLIENTSECRET', 'sessiontoken', 'refreshtoken', 'idtoken', 'csrftoken', 'privatekey', 'hapikey', 'tokens', 'api_keys',
            'password1', 'NEWPASSWORD', 'passphrase', 'pw', 'code', 'jwt', 'sid', 'sessionid', 'session_id', 'otp', 'client_assertion',
            'SAMLResponse', '_csrf', 'credentials'];
        names.forEach(function (name) {
            const out = format_error_report({message: 'failed', config: {method: 'get', url: `/x?${name}=S_SECRET&page=2`, headers: {}}, stack: 'stack'});
            assert.ok(out.includes(`GET /x?${name}=***&page=2`), `${name}: ${out}`);
        });
    });
    it('should still leave ordinary names alone', function () {
        const names = ['postal_code', 'barcode', 'encode', 'hotkeys', 'turkey', 'sessions_count', 'codes', 'sidebar'];
        names.forEach(function (name) {
            const out = format_error_report({message: 'failed', config: {method: 'get', url: `/x?${name}=visible&page=2`, headers: {}}, stack: 'stack'});
            assert.ok(out.includes(`GET /x?${name}=visible&page=2`), `${name}: ${out}`);
        });
    });
    it('should mask pairs after ";" and "#", and secrets nested in a value', function () {
        const urls = [
            'https://api.example.invalid/x?a=1;token=SEMI_SECRET',
            'https://api.example.invalid/cb#access_token=FRAG_SECRET&state=1',
            'https://api.example.invalid/x?next=https://u:NESTED1_SECRET@h.invalid/?token=NESTED2_SECRET',
            'https://api.example.invalid/x?callback=https%3A%2F%2Fcb.invalid%2Fhook%3Ftoken%3DNESTED3_SECRET',
            'https://api.example.invalid/x?filter=%7B%22password%22%3A%22JSON_SECRET%22%2C%22page%22%3A2%7D',
        ];
        urls.forEach(function (url) {
            const out = format_error_report({message: 'failed', config: {method: 'get', url, headers: {}}, stack: 'stack'});
            assert.ok(!/SECRET/.test(out), out);
        });
        const out = format_error_report({message: 'failed', config: {method: 'get', url: urls[1], headers: {}}, stack: 'stack'});
        assert.ok(out.includes('GET https://api.example.invalid/cb#access_token=***&state=1'), out);
    });
    it('should mask URLs in the message, the stack and header values', function () {
        const message = 'Failed to parse URL from https://user:M1_SECRET@127.0.0.1:99999/x?token=M2_SECRET';
        const error = {
            message,
            stack: `TypeError: ${message}\n    at fetch (node:internal/deps/undici/undici:1:1)`,
            config: {method: 'get', url: '/x', headers: {Referer: 'https://u:R1_SECRET@app.invalid/?token=R2_SECRET'}},
        };
        const a = format_error_report(error);
        assert.ok(!/SECRET/.test(a), a);
        assert.ok(a.includes('Failed to parse URL from https://***@127.0.0.1:99999/x?token=***'), a);
        assert.ok(a.includes('"Referer": "https://***@app.invalid/?token=***"'), a);
        const b = format_error_report(Object.assign(new Error(message), {stack: error.stack}));
        assert.ok(!/SECRET/.test(b), b);
        assert.ok(b.includes('at fetch (node:internal/deps/undici/undici:1:1)'), b);
    });
    it('should mask the request of an axios error with a response and keep the bounded body', function () {
        const config = {
            method: 'get',
            url: 'https://example.invalid/api?token=T_SECRET',
            headers: {Authorization: 'Bearer TOP_SECRET', Accept: 'text/plain'},
        };
        const error = {
            message: 'Request failed with status code 500',
            config,
            response: {status: 500, statusText: 'Internal Server Error', config, data: 'x'.repeat(20000)},
            stack: 'stack',
        };
        const out = format_error_report(error);
        assert.ok(!/SECRET/.test(out), out);
        assert.ok(out.includes('GET https://example.invalid/api?token=***'), out);
        assert.ok(out.includes('"Authorization": "***"'), out);
        assert.ok(out.includes('"Accept": "text/plain"'), out);
        assert.ok(out.includes('500 Internal Server Error'), out);
        assert.ok(out.includes('x'.repeat(10240)), out);
        assert.ok(!out.includes('x'.repeat(10241)), out);
    });
});
