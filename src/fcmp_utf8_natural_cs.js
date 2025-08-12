// Natural sort (numeric), case-sensitive
function fcmp_utf8_natural_cs(a, b)
{
    return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'variant'});
}

module.exports = fcmp_utf8_natural_cs;
