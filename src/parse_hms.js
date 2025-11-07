function parse_hms(expr)
{
    if (!expr && expr !== 0) {
        return Number.NaN;
    }

    expr = String(expr).trim();
    if (!expr) return Number.NaN;

    const parts = expr.split(':');

    let h = 0, m = 0, s = 0;

    if (parts.length === 1) {
        // "SS(.fff)"
        s = parseFloat(parts[0]);
    }
    else if (parts.length === 2) {
        // "MM:SS(.fff)"
        m = parseFloat(parts[0]);
        s = parseFloat(parts[1]);
    }
    else if (parts.length === 3) {
        // "HH:MM:SS(.fff)"
        h = parseFloat(parts[0]);
        m = parseFloat(parts[1]);
        s = parseFloat(parts[2]);
    }
    else {
        return Number.NaN;
    }

    // Any failed numeric parse ⇒ NaN
    if ([h, m, s].some(n => Number.isNaN(n))) {
        return Number.NaN;
    }

    return h*3600 + m*60 + s;
}

module.exports = parse_hms;
