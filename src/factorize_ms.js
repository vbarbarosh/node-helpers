function factorize_ms(v)
{
    const h = Math.floor(v / 3600000);
    const m = Math.floor(v % 3600000 / 60000);
    const s = Math.floor(v % 60000 / 1000);
    const ms = v % 1000;
    return [h, m, s, ms];
}

module.exports = factorize_ms;
