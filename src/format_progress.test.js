const assert = require('assert');
const format_progress = require('./format_progress');

const items = [
    ['~', {percents: 0, total: 0, done: 0, rate: 0, eta: 0, duration: 0}],
    ['~ duration=00:00:01', {percents: 0, total: 0, done: 0, rate: 0, eta: 0, duration: 1}],
    ['25.25% | 5.0MB of 15.0MB at ~ ETA ~ duration=00:00:01', {percents: 0.2525, total: 15*1024*1024, done: 5*1024*1024, rate: 0, eta: 0, duration: 1}],
    ['25.25% | 5.0MB of 15.0MB at 10.0MB/s ETA 00:00:05 duration=00:00:01', {percents: 0.2525, total: 15*1024*1024, done: 5*1024*1024, rate: 10*1024*1024, eta: 5, duration: 1}],
    // edge case: done > total
    ['15.0MB at 10.0MB/s duration=00:00:01', {percents: 5.2525, total: 5*1024*1024, done: 15*1024*1024, rate: 10*1024*1024, eta: 5, duration: 1}],
];

describe('format_progress', function () {
    items.forEach(function ([expected, input]) {
        it(expected, function () {
            assert.strictEqual(format_progress(input), expected);
        });
    });
});
