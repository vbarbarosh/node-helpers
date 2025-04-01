function date_add_seconds(date, seconds)
{
    date.setSeconds(date.getSeconds() + seconds);
    return date;
}

module.exports = date_add_seconds;
