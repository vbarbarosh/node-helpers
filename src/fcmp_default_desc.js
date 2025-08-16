function fcmp_default_desc(b, a)
{
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

module.exports = fcmp_default_desc;
