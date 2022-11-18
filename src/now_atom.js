/**
 * Return current date in ATOM format (e.g. "2021-07-17T23:27:01.030Z")
 *
 * @returns {string}
 * @link https://www.php.net/manual/en/class.datetimeinterface.php#datetime.constants.atom
 */
function now_atom()
{
    return (new Date()).toJSON();
}

module.exports = now_atom;
