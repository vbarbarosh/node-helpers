function format_date(d)
{
    return d.getFullYear() + `/0${d.getMonth()+1}/0${d.getDate()} 0${d.getHours()}:0${d.getMinutes()}:0${d.getSeconds()}`.replace(/0(\d\d)/g, '$1');
}

module.exports = format_date;
