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
        message: error.message ?? 'n/a',
        stack: error.stack && error.stack.split(/\n\s*/)
    }, null, 4);
}

function fm_axios_response(error)
{
    return `
${error.message ?? 'n/a'}

--- REQUEST ---

${(error.response.config.method||'').toUpperCase()} ${mask_url(error.response.config.url)}

${JSON.stringify(mask_headers(error.response.config.headers||{}), null, 4).slice(1, -1).replace(/^\s+|,$/mg, '').trim()}

--- RESPONSE ---

${error.response.status} ${error.response.statusText}

${String(error.response.data ?? '').slice(0, 10240) || 'n/a'}

--- STACK ---

${error.stack ?? 'n/a'}
`.trimStart();
}

function fm_axios_config(error)
{
    return `
${error.message ?? 'n/a'}

--- REQUEST ---

${(error.config.method||'').toUpperCase()} ${mask_url(error.config.url)}

${JSON.stringify(mask_headers(error.config.headers||{}), null, 4).slice(1, -1).replace(/^\s+|,$/mg, '').trim()}

--- STACK ---

${error.stack ?? 'n/a'}
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
        if (SENSITIVE_HEADERS.has(String(key).toLowerCase())) {
            out[key] = MASK;
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
function mask_url(url)
{
    if (url === undefined || url === null) {
        return url;
    }
    return String(url)
        .replace(/^([a-z][a-z0-9+.-]*:\/\/)[^/?#@]*@/i, `$1${MASK}@`)
        .replace(/([?&])([^=&#]*)=[^&#]*/g, function (match, sep, name) {
            return is_sensitive_query_name(name) ? `${sep}${name}=${MASK}` : match;
        });
}

function is_sensitive_query_name(name)
{
    try {
        name = decodeURIComponent(name);
    }
    catch {
        // keep the raw name
    }
    // whole names such as `apikey`, `accesstoken`, `api-key`
    if (SENSITIVE_QUERY_WORDS.has(name.toLowerCase().replace(/[^a-z0-9]/g, ''))) {
        return true;
    }
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .some(segment => SENSITIVE_QUERY_WORDS.has(segment));
}

module.exports = format_error_report;
