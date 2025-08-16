const fcmp_default = require('./fcmp_default');
const fcmp_default_desc = require('./fcmp_default_desc');
const identity = require('./identity');

const MISSING = Symbol('fcmpx.missing');

/**
 * Comparator builder using compact expressions.
 *
 * fcmp expression — Creates an `fcmp` function from an expression, suitable for use with `[].sort()`.
 *
 * fcmpx('user.email')
 * fcmpx('-user.age,user.email')
 * fcmpx(v => v.user.email)
 * fcmpx(['user.age', 'user.email'])
 * fcmpx(['-user.age', 'user.email'])
 */
function fcmpx(expr)
{
    if (typeof expr === 'string') {
        if (expr.includes(',')) {
            return fcmpx(expr.split(','));
        }
        return fcmpx_compile(expr);
    }
    if (!Array.isArray(expr)) {
        return fcmpx_compile(expr);
    }
    const fcmp_items = expr.map(fcmpx_parse);
    return function (a, b) {
        const tuple1 = fcmp_items.map(v => v.read(a));
        const tuple2 = fcmp_items.map(v => v.read(b));
        for (let i = 0; i < fcmp_items.length; ++i) {
            const tmp = fcmp_items[i].fcmp(tuple1[i], tuple2[i]);
            if (tmp) {
                return tmp;
            }
        }
        return 0;
    };
}

function fcmpx_compile(expr)
{
    const {read, fcmp} = fcmpx_parse(expr);
    return function (a, b) {
        return fcmp(read(a), read(b));
    };
}

function fcmpx_parse(expr)
{
    if (typeof expr === 'function') {
        return {read: fcmpx_compile_read(expr), fcmp: fcmp_wrapper(fcmp_default)};
    }
    if (typeof expr === 'string') {
        const desc = expr.startsWith('-');
        const read = desc ? fcmpx_compile_read(expr.slice(1)) : fcmpx_compile_read(expr);
        const fcmp = fcmp_wrapper(desc ? fcmp_default_desc : fcmp_default);
        return {read, fcmp};
    }
    const fcmp_user = expr.fcmp;
    const read = fcmpx_compile_read(expr.read);
    const desc = expr.desc ?? false;
    const fcmp = fcmp_wrapper(desc ? (fcmp_user ? (b, a) => fcmp_user(a, b) : fcmp_default_desc) : (fcmp_user ?? fcmp_default));
    if (Array.isArray(expr.top)) {
        const priority = new Map(expr.top.map((v, i) => [v, i]));
        return {read: v => priority.get(read(v)) ?? priority.size, fcmp};
    }
    if (Array.isArray(expr.bottom)) {
        const priority = new Map(expr.bottom.map((v, i) => [v, i]));
        return {read: v => priority.get(read(v)) ?? -1, fcmp};
    }
    return {read, fcmp};
}

function fcmpx_compile_read(read)
{
    if (read === undefined || read === '' || read === '.') {
        return identity;
    }
    if (typeof read === 'function') {
        return function (value) {
            return read(value) ?? MISSING;
        };
    }
    if (typeof read === 'string') {
        const props = read.split('.');
        const [a, b, c, d, e] = props;
        switch (props.length) {
        case 1: return v => v?.[a] ?? MISSING;
        case 2: return v => v?.[a]?.[b] ?? MISSING;
        case 3: return v => v?.[a]?.[b]?.[c] ?? MISSING;
        case 4: return v => v?.[a]?.[b]?.[c]?.[d] ?? MISSING;
        case 5: return v => v?.[a]?.[b]?.[c]?.[d]?.[e] ?? MISSING;
        default: return v => props.reduce((a,p) => a?.[p], v) ?? MISSING;
        }
    }
    return v => v?.[read] ?? MISSING;
}

// Sorting rule: Missing values are considered greater than any defined value
// and are therefore placed after all defined values.
function fcmp_wrapper(fcmp)
{
    return function (a, b) {
        if (a === MISSING) {
            if (b === MISSING) {
                return 0;
            }
            return 1;
        }
        if (b === MISSING) {
            return -1;
        }
        return fcmp(a, b);
    };
}

module.exports = fcmpx;
