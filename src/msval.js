function msval(h, m, s, ms)
{
    return h*3600000 + m*60000 + s*1000 + ms;
}

module.exports = msval;
