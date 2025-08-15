function now_fs()
{
    return new Date().toJSON().replace('T', '_').replaceAll('-', '').replaceAll(':', '').slice(0, 15);
}

module.exports = now_fs;
