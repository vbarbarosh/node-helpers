function sanitize_dash_name(s)
{
    // https://stackoverflow.com/a/37511463
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/, '').toLowerCase();
}

module.exports = sanitize_dash_name;
