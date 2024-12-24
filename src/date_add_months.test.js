const assert = require('assert');
const date_add_months = require('./date_add_months');
const format_date_ymd = require('./format_date_ymd');

const items = [
    ['2024/12/24', '2024/12/24', 0],
    ['2024/12/24', '2025/01/24', 1],
    ['2024/12/24', '2024/11/24', -1],
    ['2012/01/14', '2011/10/14', -3],
    ['2019/03/31', '2019/02/28', -1],
    ['2023/01/15', '2023/04/15', 3, 'Basic Positive Addition'],
    ['2023/05/15', '2023/03/15', -2, 'Basic Negative Addition'],
    ['2023/10/15', '2024/03/15', 5, 'Year Crossover (Positive)'],
    ['2023/03/15', '2022/10/15', -5, 'Year Crossover (Negative)'],
    ['2024/02/29', '2025/02/28', 12, 'Leap Year - Adding Months in Leap Year'],
    ['2024/03/01', '2023/03/01', -12, 'Negative Leap Year Crossover'],
    ['2023/01/31', '2023/02/28', 1, 'End of Month (31st to Shorter Month)'],
    ['2023/03/31', '2023/02/28', -1, 'End of Month Crossover (Negative)'],
    ['2023/06/15', '2023/06/15', 0, 'Zero Months Added'],
    ['2023/01/01', '2033/01/01', 120, 'Large Positive Addition'],
    ['2023/01/01', '2013/01/01', -120, 'Large Negative Addition'],
    ['2020/02/29', '2024/02/29', 48, 'Multiple Leap Years'],
    ['2023/12/15', '2024/01/15', 1, 'Adding to December'],
    ['2023/01/15', '2022/12/15', -1, 'Subtracting from January'],
    ['2023/05/31', '2023/06/30', 1, 'Day Preservation with Shorter Month'],
    ['2023/02/28', '2024/02/28', 12, 'Adding Months to February (Non-Leap Year)'],
    ['2024/03/01', '2023/02/01', -13, 'Negative Months Across Leap Year'],
    ['2000/01/01', '2030/01/01', 360, 'Multiple Decades'],
    ['1970/01/01', '2020/01/01', 600, 'Edge Case: Epoch Date'],
    ['3000/01/01', '2900/01/01', -1200, 'Far Future Date']
];

describe('date_add_months', function () {
    items.forEach(function ([input, expected, months, message]) {
        it(`${input} → ${expected}`, function () {
            const d = date_add_months(new Date(input), months);
            assert.strictEqual(format_date_ymd(d), expected, message);
        });
    });
});
