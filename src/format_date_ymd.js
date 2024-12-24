function format_date_ymd(d)
{
    return d.getFullYear() + `/0${d.getMonth()+1}/0${d.getDate()}`.replace(/0(\d\d)/g, '$1');
}

module.exports = format_date_ymd;
