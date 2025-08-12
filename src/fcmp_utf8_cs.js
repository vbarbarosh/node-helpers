// Locale-aware, case-sensitive, like utf8_cs or utf8mb4_cs (but using system locale)
function fcmp_utf8_cs(a, b)
{
    return a.localeCompare(b, undefined, {sensitivity: 'variant'});
}

module.exports = fcmp_utf8_cs;
