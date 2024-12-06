/**
 * Return a human-readable representation of hrtime (the return value from `process.hrtime(hrtime0)`).
 */
function format_hrtime(hrtime, digits = 6)
{
    const [u, v] = hrtime; // process.hrtime(hrtime0)
    return (u + v/1E9).toFixed(digits) + 's';
}

module.exports = format_hrtime;
