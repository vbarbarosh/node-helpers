const format_date_human = require('./format_date_human');

function now_human()
{
    return format_date_human(new Date());
}

module.exports = now_human;
