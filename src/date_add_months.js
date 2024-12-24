/**
 * @link https://stackoverflow.com/a/7937257
 */
function date_add_months(d, months)
{
    if (!months) {
        return d;
    }

    // https://github.com/briannesbitt/Carbon/blob/f01cfa96468f4c38325f507ab81a4f1d2cd93cfe/src/Carbon/Traits/Units.php#L360C1-L361C1
    // > } elseif (isset($canOverflow, $day) && $canOverflow && $day !== $date?->day) {
    // >     $date = $date?->modify('last day of previous month');
    // > }

    const date0 = d.getDate();
    d.setMonth(d.getMonth() + months);
    if (d.getDate() !== date0) {
        d.setDate(0);
    }

    return d;
}

module.exports = date_add_months;
