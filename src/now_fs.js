const format_date_fs = require('./format_date_fs');

function now_fs()
{
    return format_date_fs(new Date());
}

module.exports = now_fs;
