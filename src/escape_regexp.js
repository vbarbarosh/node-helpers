/**
 * @link https://stackoverflow.com/a/6969486/23502239
 */
function escape_regexp(s)
{
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = escape_regexp;
