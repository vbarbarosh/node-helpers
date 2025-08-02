function date_diff_seconds(a, b)
{
    return Math.floor((a.getTime() - b.getTime())/1000);
}

module.exports = date_diff_seconds;
