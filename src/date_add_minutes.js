function date_add_minutes(date, minutes)
{
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

module.exports = date_add_minutes;
