function format_seconds(seconds)
{
    const v = Math.abs(Math.trunc(seconds));
    const hh = Math.floor(v / 60 / 60);
    const mm = Math.floor(v / 60) % 60;
    const ss = v % 60;
    const tmp = `0${hh}:0${mm}:0${ss}`.replace(/0(\d\d)/g, '$1');
    return (seconds <= -1) ? ('-' + tmp) : tmp;
}

module.exports = format_seconds;
