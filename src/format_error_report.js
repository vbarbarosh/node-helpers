const json_stringify_safe = require('./json_stringify_safe');

const MASK = '***';

// Header names (lower-cased) whose value is masked in the report
const SENSITIVE_HEADERS = new Set([
    'api-key',
    'authorization',
    'cookie',
    'proxy-authorization',
    'set-cookie',
    'x-api-key',
    'x-auth-token',
]);

// A query parameter is sensitive when any of its name's segments (split on
// `_`, `-`, `.` and camelCase boundaries, lower-cased) is one of these words,
// so `api_key`, `apiKey`, `access_token`, `x-auth-token`, `sig` and `key`
// match while `keyword`, `design`, `author`, `keyboard`, `signal` do not
const SENSITIVE_QUERY_WORDS = new Set([
    'accesstoken',
    'apikey',
    'auth',
    'authorization',
    'key',
    'pass',
    'passwd',
    'password',
    'pwd',
    'secret',
    'sig',
    'signature',
    'token',
]);

// A segment that ends with one of these is sensitive as well, once a
// trailing number and a plural "s" are dropped: `authtoken`, `clientsecret`,
// `NEWPASSWORD`, `password1`, `tokens`; `tokenizer` and `secretary` are not
const SENSITIVE_QUERY_ENDINGS = ['apikey', 'passwd', 'password', 'secret', 'token'];

// Names that are sensitive only as the whole name, separators removed:
// `code` but not `postal_code`, `sid` but not `sidebar`
const SENSITIVE_QUERY_NAMES = new Set([
    'accesskey',
    'assertion',
    'authkey',
    'clientassertion',
    'code',
    'credential',
    'credentials',
    'csrf',
    'hapikey',
    'jwt',
    'otp',
    'passphrase',
    'privatekey',
    'pw',
    'samlrequest',
    'samlresponse',
    'secretkey',
    'session',
    'sessionid',
    'sessionkey',
    'sid',
    'xsrf',
]);

function format_error_report(error)
{
    if (!error) {
        return json_stringify_safe({error: error === undefined ? '---undefined---' : error});
    }

    if (error.response?.status && error.response?.statusText && error.response?.config) {
        return fm_axios_response(error);
    }

    if (error.config) {
        return fm_axios_config(error);
    }

    return json_stringify_safe({
        code: error.code,
        name: error.name,
        message: mask_text(error.message ?? 'n/a'),
        stack: error.stack && mask_text(error.stack).split(/\n\s*/)
    }, null, 4);
}

function fm_axios_response(error)
{
    return `
${mask_text(error.message ?? 'n/a')}

--- REQUEST ---

${(error.response.config.method||'').toUpperCase()} ${mask_url(error.response.config.url)}

${JSON.stringify(mask_headers(error.response.config.headers||{}), null, 4).slice(1, -1).replace(/^\s+|,$/mg, '').trim()}

--- RESPONSE ---

${error.response.status} ${error.response.statusText}

${String(error.response.data ?? '').slice(0, 10240) || 'n/a'}

--- STACK ---

${mask_text(error.stack ?? 'n/a')}
`.trimStart();
}

function fm_axios_config(error)
{
    return `
${mask_text(error.message ?? 'n/a')}

--- REQUEST ---

${(error.config.method||'').toUpperCase()} ${mask_url(error.config.url)}

${JSON.stringify(mask_headers(error.config.headers||{}), null, 4).slice(1, -1).replace(/^\s+|,$/mg, '').trim()}

--- STACK ---

${mask_text(error.stack ?? 'n/a')}
`.trimStart();
}

/**
 * Returns a copy of `headers` with sensitive values replaced by [MASK].
 * Header names are matched case-insensitively. Axios may nest headers per
 * method (`headers.common`, `headers.get`, ...) and may pass an AxiosHeaders
 * instance (which serializes via `toJSON`), so nested objects are walked too.
 */
function mask_headers(headers)
{
    if (!headers || typeof headers !== 'object') {
        return headers;
    }
    if (typeof headers.toJSON === 'function') {
        headers = headers.toJSON();
    }
    if (Array.isArray(headers)) {
        return headers.map(mask_headers);
    }
    const out = {};
    Object.entries(headers).forEach(function ([key, value]) {
        if (SENSITIVE_HEADERS.has(String(key).toLowerCase()) || is_sensitive_query_name(String(key))) {
            out[key] = MASK;
        }
        else if (typeof value === 'string') {
            // Referer, Location, Origin, ...
            out[key] = mask_text(value);
        }
        else {
            out[key] = mask_headers(value);
        }
    });
    return out;
}

/**
 * Replaces URL userinfo (`scheme://user:pass@host`) and the values of query
 * parameters with a sensitive-looking name by [MASK]. Works on the raw
 * string so the rest of the URL is reported exactly as it was requested.
 */
function mask_url(url, depth = 0)
{
    if (url === undefined || url === null) {
        return url;
    }
    return String(url)
        // everything up to the last "@" of the authority: a password may
        // hold an "@" of its own; a scheme-relative //user:pass@host too
        .replace(/^((?:[a-z][a-z0-9+.-]*:)?\/\/)[^/?#]*@/i, `$1${MASK}@`)
        // name=value pairs of the query and of the fragment, split by & or ;
        .replace(/([?&;#])([^=&;#?]*)=([^&;#]*)/g, function (match, sep, name, value) {
            if (is_sensitive_query_name(name)) {
                return `${sep}${name}=${MASK}`;
            }
            return `${sep}${name}=${mask_value(value, depth)}`;
        });
}

// A value that is itself a URL, or JSON, may carry a secret of its own
function mask_value(value, depth)
{
    if (depth >= 3 || !/[:=%{[]/.test(value)) {
        return value;
    }
    let decoded = value;
    try {
        decoded = decodeURIComponent(value);
    }
    catch {
        // keep the raw value
    }
    let masked = decoded;
    if (/^\s*[{[]/.test(decoded)) {
        try {
            const parsed = JSON.parse(decoded);
            const after = JSON.stringify(mask_json(parsed));
            // JSON with nothing to mask is reported as it was written
            if (after !== JSON.stringify(parsed)) {
                masked = after;
            }
        }
        catch {
            // not JSON after all
        }
    }
    if (masked === decoded && /\/\/|=/.test(decoded)) {
        masked = mask_url(decoded, depth + 1);
    }
    if (masked === decoded) {
        return value;
    }
    return decoded === value ? masked : encodeURIComponent(masked);
}

function mask_json(value)
{
    if (Array.isArray(value)) {
        return value.map(mask_json);
    }
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, is_sensitive_query_name(k) ? MASK : mask_json(v)]));
    }
    return typeof value === 'string' ? mask_text(value) : value;
}

/**
 * Masks every URL found in a piece of text: a message, a stack, a header
 * value.
 */
function mask_text(text)
{
    if (typeof text !== 'string') {
        return text;
    }
    return text.replace(/(?:[a-z][a-z0-9+.-]*:)?\/\/[^\s"'<>\\)]+/gi, v => mask_url(v));
}

function is_sensitive_query_name(name)
{
    try {
        name = decodeURIComponent(name);
    }
    catch {
        // keep the raw name
    }
    // whole names such as `apikey`, `accesstoken`, `api-key`, `session_id`
    const whole = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (SENSITIVE_QUERY_WORDS.has(whole) || SENSITIVE_QUERY_NAMES.has(whole)) {
        return true;
    }
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .some(function (segment) {
            if (SENSITIVE_QUERY_WORDS.has(segment)) {
                return true;
            }
            // password1, tokens, api_keys
            const bare = segment.replace(/\d+$/, '').replace(/s$/, '');
            return SENSITIVE_QUERY_WORDS.has(bare) || SENSITIVE_QUERY_ENDINGS.some(v => bare.endsWith(v));
        });
}

module.exports = format_error_report;
