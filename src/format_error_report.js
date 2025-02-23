const json_stringify_safe = require('./json_stringify_safe');

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

${(error.response.config.method||'').toUpperCase()} ${error.response.config.url}

${JSON.stringify(error.response.config.headers||{}, null, 4).slice(1, -1).replace(/^\s+|,$/mg, '').trim()}

--- RESPONSE ---

${error.response.status} ${error.response.statusText}

${(error.response.data.toString()||'').slice(0, 10240) || 'n/a'}

--- STACK ---

${error.stack ? error.stack.split(/\\n\\s*/) : 'n/a'}
`.trimStart();
}

function fm_axios_config(error)
{
    return `
${error.message ?? 'n/a'}

--- REQUEST ---

${(error.config.method||'').toUpperCase()} ${error.config.url}

${JSON.stringify(error.config.headers||{}, null, 4).slice(1, -1).replace(/^\s+|,$/mg, '').trim()}

--- STACK ---

${error.stack ? error.stack.split(/\\n\\s*/) : 'n/a'}
`.trimStart();
}

module.exports = format_error_report;
