function plural_ru(n, one, few, many, zero)
{
    if (n === 0 && typeof zero === 'string') {
        return zero;
    }
    return plural_ru_form(n, one, few, many).split('#').join(n);
}

// Russian counts in three forms: one (1, 21, 101), few (2-4, 22-24, 102-104)
// and many (0, 5-20, 25-30, 111-114). A fraction takes the few form: 1.5 яблока.
function plural_ru_form(n, one, few, many)
{
    if (!Number.isInteger(n)) {
        return few;
    }
    const mod10 = Math.abs(n) % 10;
    const mod100 = Math.abs(n) % 100;
    if (mod10 === 1 && mod100 !== 11) {
        return one;
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        return few;
    }
    return many;
}

module.exports = plural_ru;
