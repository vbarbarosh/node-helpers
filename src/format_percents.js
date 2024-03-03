function format_percents(v)
{
    return (v*100).toFixed(2).replace(/^(0|100).00$/, '$1') + '%';
}

module.exports = format_percents;
