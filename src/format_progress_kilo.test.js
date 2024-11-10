const assert = require('assert');
const format_progress_kilo = require('./format_progress_kilo');

const items = [
    ['~', {percents: 0, total: 0, done: 0, rate: 0, eta: 0, duration: 0}],
    ['~ duration=00:00:01', {percents: 0, total: 0, done: 0, rate: 0, eta: 0, duration: 1}],
    ['25.25% | 5.00M of 15.00M at ~ ETA ~ duration=00:00:01', {percents: 0.2525, total: 15*1000*1000, done: 5*1000*1000, rate: 0, eta: 0, duration: 1}],
    ['25.25% | 5.00M of 15.00M at 10.00M/s ETA 00:00:05 duration=00:00:01', {percents: 0.2525, total: 15*1000*1000, done: 5*1000*1000, rate: 10*1000*1000, eta: 5, duration: 1}],
    // edge case: done > total
    ['15.00M at 10.00M/s duration=00:00:01', {percents: 5.2525, total: 5*1000*1000, done: 15*1000*1000, rate: 10*1000*1000, eta: 5, duration: 1}],
];

describe('format_progress_kilo', function () {
    items.forEach(function ([expected, input]) {
        it(expected, function () {
            assert.strictEqual(format_progress_kilo(input), expected);
        });
    });
});
