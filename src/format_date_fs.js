// // 20260916_210411, local time
// function format_date_fs(date)
// {
//     return [date.getFullYear(), date.getMonth() + 1, date.getDate(), '_',
//             date.getHours(), date.getMinutes(), date.getSeconds()]
//         .map(v => typeof v === 'string' || v > 9 ? v : `0${v}`).join('');
// }

function format_date_fs(d)
{
    const ymd = d.getFullYear() + dd(d.getMonth() + 1) + dd(d.getDate());
    const hms = dd(d.getHours()) + dd(d.getMinutes()) + dd(d.getSeconds());
    return ymd + '_' + hms;
}

function dd(v)
{
    return v > 9 ? `${v}` : `0${v}`;
}

module.exports = format_date_fs;
