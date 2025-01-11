/**
 * Create fcmp from an array of props. For desc order a prop should be prefixed with minus sign (e.g. -price).
 */
function fcmp_from_spec(props)
{
    const fcmp = props.map(one);
    switch (fcmp.length) {
    case 0:
        return () => 0;
    case 1:
        return fcmp[0];
    case 2:
        return function (a, b) {
            return fcmp[0](a, b) || fcmp[1](a, b);
        };
    case 3:
        return function (a, b) {
            return fcmp[0](a, b) || fcmp[1](a, b) || fcmp[2](a, b);
        };
    default:
        return function (a, b) {
            for (let i = 0; i < fcmp.length; ++i) {
                const tmp = fcmp[i](a, b);
                if (tmp) {
                    return tmp;
                }
            }
            return 0;
        };
    }
}

function one(prop)
{
    if (prop[0] === '-') {
        prop = prop.slice(1);
        return function (b, a) {
            return comp_types(a[prop], b[prop]);
        };
    }
    return function (a, b) {
        return comp_types(a[prop], b[prop]);
    };
}

function comp_types(a, b)
{
    const ta = typeof a;
    const tb = typeof b;
    if (ta === 'string' && ta === tb) {
        return a.localeCompare(b);
    }
    return a - b;
}

module.exports = fcmp_from_spec;
