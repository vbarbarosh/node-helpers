// // round(34.037531, 0.001) -> 34.038000000000004
// function round(value, precision = 1)
// {
//     return Math.round(value / precision) * precision;
// }

// // round(1.005, 0.01) -> 1
// function round(value, precision = 1)
// {
//     const p = 1 / precision;
//     return Math.round(value * p) / p;
// }

function round(value, precision = 1)
{
    if (precision === 0) {
        return value;
    }
    const factor = 1 / precision;
    const epsilon = 1e-12 * Math.sign(value);
    return Math.round((value * factor) + epsilon) / factor;
}

module.exports = round;
