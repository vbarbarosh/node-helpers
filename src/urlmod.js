/**
 * Set, change, or remove query string parameters.
 *
 * urlmod('', {a: 1})           '?a=1'  set
 * urlmod('?a=1', {a: 2})       '?a=2'  change
 * urlmod('?a=1', {a: null})    ''      remove
 */
function urlmod(url, params)
{
    const tmp_url = new URL(url||'', 'xxx://___base___/');
    const tmp_search = tmp_url.searchParams;
    Object.entries(params || {}).forEach(function ([key, value]) {
        switch (value) {
        case null:
        case undefined:
            tmp_search.delete(key);
            break;
        case true:
            tmp_search.set(key, 1);
            break;
        case false:
            tmp_search.set(key, 0);
            break;
        default:
            tmp_search.set(key, value);
            break;
        }
    });
    if (url && url[0] === '/') {
        return tmp_url.toString().replace(/^xxx:\/\/___base___/, '');
    }
    return tmp_url.toString().replace(/^xxx:\/\/___base___\//, '');
}

module.exports = urlmod;
