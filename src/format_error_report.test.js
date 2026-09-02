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
