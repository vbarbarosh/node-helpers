/**
 * Creates a filtering function based on the following spec:
 * 1. Substrings are separated by `/`.
 * 2. Each substring may have special characters:
 *    - `^`: Substring must appear at the beginning.
 *    - `$`: Substring must appear at the end.
 *    - `!`: Negates the condition (substring must not appear).
 */
function filter1_from_spec(spec)
{
    let a, b, c, d;
    const parts = parse_spec(spec);
    switch (parts.length) {
    case 0:
        // No filters, always true
        return () => true;
    case 1:
        return parts[0];
    case 2:
        [a, b] = parts;
        return s => a(s) && b(s);
    case 3:
        [a, b, c] = parts;
        return s => a(s) && b(s) && c(s);
    case 4:
        [a, b, c, d] = parts;
        return s => a(s) && b(s) && c(s) && d(s);
    default:
        return s => parts.every(fn => fn(s));
    }
}

function parse_spec(spec)
{
    return spec.split('/').filter(v => v).map(parse_expr);
}

// convert expr into an array of objects {substr, starts, ends}
function parse_expr(expr)
{
    let substr;
    let starts = false; // ^
    let ends = false; // $
    substr = expr.replaceAll('^', '');
    starts = (substr.length !== expr.length);
    expr = substr;
    substr = expr.replaceAll('$', '');
    ends = (substr.length !== expr.length);
    expr = substr;
    substr = expr.replaceAll('!', '');
    if ((expr.length - substr.length) % 2) { // not
        if (starts && ends) {
            return s => !s.startsWith(substr) && !s.endsWith(substr);
        }
        if (starts) {
            return s => !s.startsWith(substr);
        }
        if (ends) {
            return s => !s.endsWith(substr);
        }
        return s => !s.includes(substr);
    }
    if (starts && ends) {
        return s => s.startsWith(substr) && s.endsWith(substr);
    }
    if (starts) {
        return s => s.startsWith(substr);
    }
    if (ends) {
        return s => s.endsWith(substr);
    }
    return s => s.includes(substr);
}

module.exports = filter1_from_spec;
