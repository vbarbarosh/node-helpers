// Locale-aware, case-insensitive, like utf8_ci or utf8mb4_ci
function fcmp_utf8_ci(a, b)
{
    return a.localeCompare(b, undefined, {sensitivity: 'base'});
}

module.exports = fcmp_utf8_ci;
