function date_add_hours(date, hours)
{
    date.setHours(date.getHours() + hours);
    return date;
}

module.exports = date_add_hours;
