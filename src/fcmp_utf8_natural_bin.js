// Natural sort (numeric), code-unit order for everything else.
// Deterministic on every machine — no Intl/ICU involved. See fcmp_default.md
function fcmp_utf8_natural_bin(a, b)
{
    const ax = a.match(/\d+|\D+/g) || [];
    const bx = b.match(/\d+|\D+/g) || [];
    const end = Math.min(ax.length, bx.length);
    for (let i = 0; i < end; ++i) {
        const is_digits = (ax[i][0] <= '9' && bx[i][0] <= '9' && ax[i][0] >= '0' && bx[i][0] >= '0');
        const tmp = is_digits ? fcmp_digits(ax[i], bx[i]) : fcmp_units(ax[i], bx[i]);
        if (tmp) {
            return tmp;
        }
    }
    return ax.length - bx.length;
}

// Compare digit runs of any length by numeric value (no Number() overflow);
// equal values differ by padding: fewer leading zeros first ('2' < '02')
function fcmp_digits(a, b)
{
    const as = a.replace(/^0+/, '');
    const bs = b.replace(/^0+/, '');
    return (as.length - bs.length) || fcmp_units(as, bs) || (a.length - b.length);
}

function fcmp_units(a, b)
{
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

module.exports = fcmp_utf8_natural_bin;
