// Natural sort (numeric), case-insensitive
function fcmp_utf8_natural_ci(a, b)
{
    return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
}

module.exports = fcmp_utf8_natural_ci;
