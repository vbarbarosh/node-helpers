function date_add_milliseconds(date, milliseconds)
{
    date.setMilliseconds(date.getMilliseconds() + milliseconds);
    return date;
}

module.exports = date_add_milliseconds;
