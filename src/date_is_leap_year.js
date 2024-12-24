/**
 * @link https://github.com/moment/moment/blob/18aba135ab927ffe7f868ee09276979bed6993a6/src/lib/utils/is-leap-year.js
 * @link https://en.wikipedia.org/wiki/Leap_year
 * > Each leap year has 366 days instead of 365. This extra leap day
 * > occurs in each year that is a multiple of 4, except for years
 * > evenly divisible by 100 but not by 400.
 */
function date_is_leap_year(d)
{
    const year = d.getFullYear();
    // return (year % 4 === 0) && !(year % 100 === 0 && year % 400 !== 0);
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

module.exports = date_is_leap_year;
