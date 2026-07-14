function round(value, precision = 1)
{
    if (precision === 0) {
        return value;
    }

    const factor = 1 / precision;
    const sign = Math.sign(value);

    // Count decimal places for the cleanup (toFixed)
    const exponent = get_decimal_places(precision);

    // Small epsilon helps fix most floating point edge cases involving ties
    const epsilon = 1e-12*sign;

    // Scale → Nudge → Round → Unscale
    const final = (Math.round(value*factor + epsilon) / factor);

    // Cleanup trailing garbage such as: 34.038000000000004 → 34.038
    return Number(final.toFixed(exponent));
}

function get_decimal_places(precision)
{
    if (Math.floor(precision) === precision) {
        return 0;
    }

    // toExponential gives MANTISSAe±EXP; decimal places = mantissa fraction
    // digits minus the exponent. Counting the exponent alone is not enough:
    // 0.25 → "2.5e-1" → 1 - (-1) = 2 (not 1, which would re-round 1.25 → 1.3)
    // 0.001 → "1e-3" → 0 - (-3) = 3
    const [mantissa, exp] = precision.toExponential().split('e');
    const digits = (mantissa.split('.')[1] || '').length;
    return Math.max(0, digits - parseInt(exp, 10));
}

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

// function round(value, precision = 1)
// {
//     if (precision === 0) {
//         return value;
//     }
//     const factor = 1 / precision;
//     const epsilon = 1e-12 * Math.sign(value);
//     return Number((Math.round((value * factor) + epsilon) / factor).toPrecision(15));
// }

// function round(value, precision = 1)
// {
//     if (precision === 0) {
//         return value;
//     }
//
//     const factor = 1 / precision;
//
//     // The exponent is critical for defining the precision of the cleanup
//     const exponent = Math.max(0, String(precision).length - 2);
//
//     // 1. Calculate the scaled value.
//     let scaled = value * factor;
//
//     // 2. Strategic Nudge: Add a tiny, signed epsilon (1e-12) to correct floating-point
//     //    representation errors and force symmetric rounding (as Math.abs failed).
//     const epsilon = 1e-12 * Math.sign(value);
//
//     // 3. Round the nudged value.
//     const roundedScaled = Math.round(scaled + epsilon);
//
//     // 4. Unscale the value.
//     const result = roundedScaled / factor;
//
//     // 5. CRITICAL FINAL STEP: Use .toFixed() with the required decimal places for cleanup.
//     // This stabilizes the result against the strict equality checks, including
//     // the safe integer boundary errors caused by the final division.
//     return Number(result.toFixed(exponent));
// }

// 💎 The most precise solution, but - extra dependency.
//
// const Decimal = require('decimal.js');
//
// function round(value, precision = 1)
// {
//     return new Decimal(value).div(precision).round().times(precision).toNumber();
// }

module.exports = round;
