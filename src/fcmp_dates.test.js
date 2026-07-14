const assert = require('assert');
const fcmp_dates = require('./fcmp_dates');

const items = [
    // [a, b, expected sign]
    ['2020-01-01T00:00:00Z', '2021-01-01T00:00:00Z', -1],
    ['2021-01-01T00:00:00Z', '2020-01-01T00:00:00Z', 1],
    ['2020-01-01T00:00:00Z', '2020-01-01T00:00:00Z', 0],
    ['2020-01-01T00:00:00.000Z', '2020-01-01T00:00:00.001Z', -1],
    ['1969-12-31T23:59:59Z', '1970-01-01T00:00:00Z', -1],
];

describe('fcmp_dates', function () {
    items.forEach(function ([a, b, expected]) {
        it(`${a} vs ${b} → ${expected}`, function () {
            assert.strictEqual(Math.sign(fcmp_dates(new Date(a), new Date(b))), expected);
        });
    });
    it('should treat distinct Date objects with the same timestamp as equal', function () {
        assert.strictEqual(fcmp_dates(new Date(1000), new Date(1000)), 0);
    });
    it('should sort dates in ascending order', function () {
        const input = ['2022-05-01', '1999-12-31', '2022-04-30', '2000-01-01'].map(v => new Date(v));
        const expected = ['1999-12-31', '2000-01-01', '2022-04-30', '2022-05-01'].map(v => new Date(v));
        assert.deepStrictEqual(input.sort(fcmp_dates), expected);
    });
    it('should throw when arguments are not Date objects', function () {
        assert.throws(() => fcmp_dates('2020-01-01', new Date()));
        assert.throws(() => fcmp_dates(new Date(), null));
    });
});
