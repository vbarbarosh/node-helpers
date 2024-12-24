const assert = require('assert');
const date_is_leap_year = require('./date_is_leap_year');

describe('date_add_months', function () {
    it('Brute force', function () {
        for (let year = 100; year < 9999; ++year) {
            const d = new Date(`${year}/01/01 00:00:00`);
            const d2 = new Date(`${year}/02/29 00:00:00`);
            assert.strictEqual(d.getFullYear(), year);
            assert.strictEqual(d2.getFullYear(), year);
            assert.strictEqual(date_is_leap_year(d), d2.getMonth() === 1, year);
        }
    });
});
