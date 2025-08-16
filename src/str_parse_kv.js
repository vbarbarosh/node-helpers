function str_parse_kv(str)
{
    const i = str.indexOf(':');
    if (i === -1) {
        return [str.trim(), ''];
    }
    return [str.slice(0, i).trim(), str.slice(i + 1).trim()];
}

module.exports = str_parse_kv;
