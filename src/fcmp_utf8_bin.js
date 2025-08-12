// Strict binary (codepoint) comparison, like MySQL's utf8_bin collation
function fcmp_utf8_bin(a, b)
{
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

module.exports = fcmp_utf8_bin;
