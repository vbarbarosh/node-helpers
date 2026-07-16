function factorize_ms(v)
{
    // Factorize the magnitude: the sign is the caller's concern, and
    // sub-millisecond fractions are truncated.
    v = Math.trunc(Math.abs(v));
    const h = Math.floor(v / 3600000);
    const m = Math.floor(v % 3600000 / 60000);
    const s = Math.floor(v % 60000 / 1000);
    const ms = v % 1000;
    return [h, m, s, ms];
}

module.exports = factorize_ms;
