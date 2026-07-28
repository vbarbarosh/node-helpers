/**
 * Set, change, or remove query string parameters.
 *
 * urlmod('', {a: 1})           '?a=1'  set
 * urlmod('?a=1', {a: 2})       '?a=2'  change
 * urlmod('?a=1', {a: null})    ''      remove
 */
function urlmod(url, params)
{
    const input_url = String(url || '');
    const entries = Object.entries(params || {});
    if (!entries.length) {
        return input_url;
    }

    const hash_pos = input_url.indexOf('#');
    const hash = hash_pos === -1 ? '' : input_url.slice(hash_pos);
    const before_hash = hash_pos === -1 ? input_url : input_url.slice(0, hash_pos);
    const query_pos = before_hash.indexOf('?');
    const before_query = query_pos === -1 ? before_hash : before_hash.slice(0, query_pos);
    const query = query_pos === -1 ? '' : before_hash.slice(query_pos + 1);
    const search = new URLSearchParams(query);

    entries.forEach(function ([key, value]) {
        switch (value) {
        case null:
        case undefined:
            search.delete(key);
            break;
        case true:
            search.set(key, '1');
            break;
        case false:
            search.set(key, '0');
            break;
        default:
            search.set(key, String(value));
            break;
        }
    });

    const output_query = search.toString();
    return before_query + (output_query ? `?${output_query}` : '') + hash;
}

module.exports = urlmod;
