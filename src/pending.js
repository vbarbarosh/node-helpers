const Promise = require('bluebird');

function pending(fn)
{
    let tmp_resolve, tmp_reject;
    const promise = new Promise(function (resolve, reject) {
        tmp_resolve = resolve;
        tmp_reject = reject;
    });
    // noinspection JSUnusedAssignment
    promise.resolve = tmp_resolve;
    // noinspection JSUnusedAssignment
    promise.reject = tmp_reject;
    promise.callback = function (error, data) {
        error ? promise.reject(error) : promise.resolve(data);
    };
    // noinspection EqualityComparisonWithCoercionJS
    if (typeof fn == 'function') {
        fn(promise.callback);
    }
    return promise;
}

module.exports = pending;
