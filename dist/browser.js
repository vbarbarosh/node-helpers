/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@vbarbarosh/type-helpers/src/is_num.js":
/*!*************************************************************!*\
  !*** ./node_modules/@vbarbarosh/type-helpers/src/is_num.js ***!
  \*************************************************************/
/***/ ((module) => {

function is_num(input)
{
    return (typeof input === 'number') && isFinite(input);
}

module.exports = is_num;


/***/ }),

/***/ "./node_modules/@vbarbarosh/type-helpers/src/is_num_gt.js":
/*!****************************************************************!*\
  !*** ./node_modules/@vbarbarosh/type-helpers/src/is_num_gt.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const is_num = __webpack_require__(/*! ./is_num */ "./node_modules/@vbarbarosh/type-helpers/src/is_num.js");

function is_num_gt(input, min)
{
    return is_num(input) && input > min;
}

module.exports = is_num_gt;


/***/ }),

/***/ "./node_modules/json-stringify-safe/stringify.js":
/*!*******************************************************!*\
  !*** ./node_modules/json-stringify-safe/stringify.js ***!
  \*******************************************************/
/***/ ((module, exports) => {

exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}


/***/ }),

/***/ "./src sync recursive \\b(array%7Cdate%7Chttp_delete%7Chttp_get_blob%7Chttp_get_buffer%7Chttp_get_json%7Chttp_get_utf8%7Chttp_head%7Chttp_patch_json%7Chttp_post_json%7Chttp_post_multipart%7Chttp_put_buffer%7Chttp_put_json%7Chttp_put_utf8%7Cidentity%7Cignore%7Cfcmp%7Cfilter%7Cformat%7Cplural%7Crandom_int%7Curlmod%7Cwaitcb)[^/]*(?<%21\\.test)\\.js$":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./src/ sync \b(array%7Cdate%7Chttp_delete%7Chttp_get_blob%7Chttp_get_buffer%7Chttp_get_json%7Chttp_get_utf8%7Chttp_head%7Chttp_patch_json%7Chttp_post_json%7Chttp_post_multipart%7Chttp_put_buffer%7Chttp_put_json%7Chttp_put_utf8%7Cidentity%7Cignore%7Cfcmp%7Cfilter%7Cformat%7Cplural%7Crandom_int%7Curlmod%7Cwaitcb)[^/]*(?<%21\.test)\.js$ ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./array_chunk.js": "./src/array_chunk.js",
	"./array_gcd.js": "./src/array_gcd.js",
	"./array_group.js": "./src/array_group.js",
	"./array_group_map.js": "./src/array_group_map.js",
	"./array_index.js": "./src/array_index.js",
	"./array_lcm.js": "./src/array_lcm.js",
	"./array_max.js": "./src/array_max.js",
	"./array_min.js": "./src/array_min.js",
	"./array_permutations.js": "./src/array_permutations.js",
	"./array_shuffle.js": "./src/array_shuffle.js",
	"./array_sort.js": "./src/array_sort.js",
	"./array_sort_other.js": "./src/array_sort_other.js",
	"./array_sum.js": "./src/array_sum.js",
	"./array_unique.js": "./src/array_unique.js",
	"./array_unique_last.js": "./src/array_unique_last.js",
	"./cli-apps/watchdog.d/ignore_sigterm.js": "./src/cli-apps/watchdog.d/ignore_sigterm.js",
	"./cli-apps/watchdog.d/my-ignore-sigterm.js": "./src/cli-apps/watchdog.d/my-ignore-sigterm.js",
	"./date_add_hours.js": "./src/date_add_hours.js",
	"./date_add_milliseconds.js": "./src/date_add_milliseconds.js",
	"./date_add_minutes.js": "./src/date_add_minutes.js",
	"./date_add_months.js": "./src/date_add_months.js",
	"./date_add_seconds.js": "./src/date_add_seconds.js",
	"./date_diff_seconds.js": "./src/date_diff_seconds.js",
	"./date_is_leap_year.js": "./src/date_is_leap_year.js",
	"./fcmp_dates.js": "./src/fcmp_dates.js",
	"./fcmp_default.js": "./src/fcmp_default.js",
	"./fcmp_default_desc.js": "./src/fcmp_default_desc.js",
	"./fcmp_from_spec.js": "./src/fcmp_from_spec.js",
	"./fcmp_numbers.js": "./src/fcmp_numbers.js",
	"./fcmp_tuples.js": "./src/fcmp_tuples.js",
	"./fcmp_utf8_bin.js": "./src/fcmp_utf8_bin.js",
	"./fcmp_utf8_ci.js": "./src/fcmp_utf8_ci.js",
	"./fcmp_utf8_cs.js": "./src/fcmp_utf8_cs.js",
	"./fcmp_utf8_natural_ci.js": "./src/fcmp_utf8_natural_ci.js",
	"./fcmp_utf8_natural_cs.js": "./src/fcmp_utf8_natural_cs.js",
	"./fcmpx.js": "./src/fcmpx.js",
	"./filter1_from_spec.js": "./src/filter1_from_spec.js",
	"./format_bytes.js": "./src/format_bytes.js",
	"./format_date.js": "./src/format_date.js",
	"./format_date_fs.js": "./src/format_date_fs.js",
	"./format_date_human.js": "./src/format_date_human.js",
	"./format_date_ymd.js": "./src/format_date_ymd.js",
	"./format_error_report.js": "./src/format_error_report.js",
	"./format_hrtime.js": "./src/format_hrtime.js",
	"./format_kilo.js": "./src/format_kilo.js",
	"./format_ms.js": "./src/format_ms.js",
	"./format_ms2.js": "./src/format_ms2.js",
	"./format_ms3.js": "./src/format_ms3.js",
	"./format_percents.js": "./src/format_percents.js",
	"./format_progress_bytes.js": "./src/format_progress_bytes.js",
	"./format_progress_kilo.js": "./src/format_progress_kilo.js",
	"./format_seconds.js": "./src/format_seconds.js",
	"./format_thousands.js": "./src/format_thousands.js",
	"./http_delete.js": "./src/http_delete.js",
	"./http_get_blob.js": "./src/http_get_blob.js",
	"./http_get_buffer.js": "./src/http_get_buffer.js",
	"./http_get_json.js": "./src/http_get_json.js",
	"./http_get_utf8.js": "./src/http_get_utf8.js",
	"./http_head.js": "./src/http_head.js",
	"./http_patch_json.js": "./src/http_patch_json.js",
	"./http_post_json.js": "./src/http_post_json.js",
	"./http_post_multipart.js": "./src/http_post_multipart.js",
	"./http_put_buffer.js": "./src/http_put_buffer.js",
	"./http_put_json.js": "./src/http_put_json.js",
	"./http_put_utf8.js": "./src/http_put_utf8.js",
	"./identity.js": "./src/identity.js",
	"./ignore.js": "./src/ignore.js",
	"./pid_kill_grace.d/ignore-sigterm-for-10ms.js": "./src/pid_kill_grace.d/ignore-sigterm-for-10ms.js",
	"./pid_kill_grace.d/ignore-sigterm.js": "./src/pid_kill_grace.d/ignore-sigterm.js",
	"./plural.js": "./src/plural.js",
	"./random_int.js": "./src/random_int.js",
	"./urlmod.js": "./src/urlmod.js",
	"./waitcb.js": "./src/waitcb.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive \\b(array%7Cdate%7Chttp_delete%7Chttp_get_blob%7Chttp_get_buffer%7Chttp_get_json%7Chttp_get_utf8%7Chttp_head%7Chttp_patch_json%7Chttp_post_json%7Chttp_post_multipart%7Chttp_put_buffer%7Chttp_put_json%7Chttp_put_utf8%7Cidentity%7Cignore%7Cfcmp%7Cfilter%7Cformat%7Cplural%7Crandom_int%7Curlmod%7Cwaitcb)[^/]*(?<%21\\.test)\\.js$";

/***/ }),

/***/ "./src/array_chunk.js":
/*!****************************!*\
  !*** ./src/array_chunk.js ***!
  \****************************/
/***/ ((module) => {

/**
 * Split an array into chunks.
 *
 * @param array
 * @param limit
 * @returns {*[]}
 */
function array_chunk(array = [], limit = 1)
{
    if (limit < 1) {
        throw new Error('Limit value should be greater than 1');
    }

    const out = [];
    for (let i = 0, end = array.length; i < end; i += limit) {
        out.push(array.slice(i, i + limit));
    }
    return out;
}

module.exports = array_chunk;


/***/ }),

/***/ "./src/array_gcd.js":
/*!**************************!*\
  !*** ./src/array_gcd.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const math_gcd = __webpack_require__(/*! ./math_gcd */ "./src/math_gcd.js");

// https://stackoverflow.com/a/39764792/1478566
function array_gcd(array, fn = Number)
{
    return array.reduce((a,b) => math_gcd(fn(a), fn(b)));
}

module.exports = array_gcd;


/***/ }),

/***/ "./src/array_group.js":
/*!****************************!*\
  !*** ./src/array_group.js ***!
  \****************************/
/***/ ((module) => {

/**
 * Group items by a common key and return an array of groups.
 *
 * @alternative Map.groupBy(items, fn)
 */
function array_group(array, fn)
{
    const map = new Map();
    array.forEach(function (item) {
        const key = fn(item);
        if (!map.has(key)) {
            map.set(key, {key, items: []});
        }
        map.get(key).items.push(item);
    });
    return map.values().toArray();
}

module.exports = array_group;


/***/ }),

/***/ "./src/array_group_map.js":
/*!********************************!*\
  !*** ./src/array_group_map.js ***!
  \********************************/
/***/ ((module) => {

/**
 * Group items by common key and return an object of items grouped by key.
 *
 * @param array
 * @param fn
 * @returns {{}}
 */
function array_group_map(array, fn)
{
    const out = {};
    array.forEach(function (item) {
        const key = fn(item);
        out[key] = out[key] || {key, items: []};
        out[key].items.push(item);
    });
    return out;
}

module.exports = array_group_map;


/***/ }),

/***/ "./src/array_index.js":
/*!****************************!*\
  !*** ./src/array_index.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const identity = __webpack_require__(/*! ./identity */ "./src/identity.js");

/**
 * Usage:
 *     array_index(items, v => v.name)
 *
 * Seems, there is a native way to do it:
 *     Object.fromEntries(items.map(v => [v.name, v]));
 */
function array_index(array, fn = identity)
{
    const out = {};
    array.forEach(v => out[fn(v)] = v);
    return out;
}

module.exports = array_index;


/***/ }),

/***/ "./src/array_lcm.js":
/*!**************************!*\
  !*** ./src/array_lcm.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const math_lcm = __webpack_require__(/*! ./math_lcm */ "./src/math_lcm.js");

function array_lcm(array, fn = Number)
{
    return array.reduce((a,b) => math_lcm(fn(a), fn(b)));
}

module.exports = array_lcm;


/***/ }),

/***/ "./src/array_max.js":
/*!**************************!*\
  !*** ./src/array_max.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const identity = __webpack_require__(/*! ./identity */ "./src/identity.js");

/**
 * Returns the first element in the array with the maximal weight
 */
function array_max(array, fn = identity)
{
    let out = null;
    let max = null;
    array.forEach(function (item, i) {
        const weight = fn(item);
        if (i === 0 || max < weight) {
            max = weight;
            out = item;
        }
    });
    return out;
}

module.exports = array_max;


/***/ }),

/***/ "./src/array_min.js":
/*!**************************!*\
  !*** ./src/array_min.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const identity = __webpack_require__(/*! ./identity */ "./src/identity.js");

/**
 * Returns the first element in the array with the minimal weight
 */
function array_min(array, fn = identity)
{
    let out = null;
    let min = null;
    array.forEach(function (item, i) {
        const weight = fn(item);
        if (i === 0 || min > weight) {
            min = weight;
            out = item;
        }
    });
    return out;
}

module.exports = array_min;


/***/ }),

/***/ "./src/array_permutations.js":
/*!***********************************!*\
  !*** ./src/array_permutations.js ***!
  \***********************************/
/***/ ((module) => {

// https://stackoverflow.com/a/37580979/23502239
function array_permutations(array, k = array.length)
{
    if (k !== array.length) {
        return array_permutations_k(array, k);
    }

    let length = array.length;
    let out = [array.slice()];
    let c = new Array(length).fill(0);
    let i = 1, kk, p;

    while (i < length) {
        if (c[i] < i) {
            kk = i % 2 && c[i];
            p = array[i];
            array[i] = array[kk];
            array[kk] = p;
            ++c[i];
            i = 1;
            out.push(array.slice());
        }
        else {
            c[i] = 0;
            ++i;
        }
    }
    return out;
}

function array_permutations_k(array, k)
{
    if (k === 0) {
        return [
            []
        ];
    }
    if (array.length < k) {
        return [];
    }

    const out = [];
    for (let i = 0; i < array.length; i++) {
        const rest = array.slice(0, i).concat(array.slice(i + 1));
        for (const perm of array_permutations(rest, k - 1)) {
            out.push([array[i], ...perm]);
        }
    }
    return out;
}

module.exports = array_permutations;


/***/ }),

/***/ "./src/array_shuffle.js":
/*!******************************!*\
  !*** ./src/array_shuffle.js ***!
  \******************************/
/***/ ((module) => {

/**
 * Shuffles an array using Durstenfeld shuffle algorithm.
 *
 * Note: This function performs shuffle in-place. In order
 * to get a shuffled copy use call slice before calling, e.g.
 * array_shuffle(items.slice()).
 *
 * @param array
 * @returns array
 * @link https://stackoverflow.com/a/6274381/1478566
 * @link https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function array_shuffle(array)
{
    for (let i = array.length; --i > 0; ) {
        const j = Math.floor(Math.random() * (i + 1));
        const x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}

module.exports = array_shuffle;


/***/ }),

/***/ "./src/array_sort.js":
/*!***************************!*\
  !*** ./src/array_sort.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fcmp_default = __webpack_require__(/*! ./fcmp_default */ "./src/fcmp_default.js");
const fcmp_tuples = __webpack_require__(/*! ./fcmp_tuples */ "./src/fcmp_tuples.js");

/**
 * Sorts an array in place by the result of applying `fn` to each item,
 * using `fcmp` to compare the results.
 *
 * array_sort(items, v => [v.name])
 * array_sort(items, v => [v.age, v.name])
 */
function array_sort(array, mapper, fcmp = fcmp_default)
{
    const keys = new Map();
    return array.sort(function (a, b) {
        if (!keys.has(a)) {
            keys.set(a, mapper(a));
        }
        if (!keys.has(b)) {
            keys.set(b, mapper(b));
        }
        return fcmp_tuples(keys.get(a), keys.get(b), fcmp);
    });
}

// function array_sort(array, fn = identity, fcmp = fcmp_default)
// {
//     return array.sort(function (a, b) {
//         return fcmp(fn(a), fn(b));
//     });
// }

module.exports = array_sort;


/***/ }),

/***/ "./src/array_sort_other.js":
/*!*********************************!*\
  !*** ./src/array_sort_other.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fcmp_default = __webpack_require__(/*! ./fcmp_default */ "./src/fcmp_default.js");

/**
 * Sort items in an `array` at the same order as in `other`. Values which
 * are not in the `other` are added to the end of the result defined by `fcmp`.
 *
 * @param array
 * @param fn
 * @param other
 * @param fcmp
 * @returns {*}
 */
function array_sort_other(array, fn, other, fcmp = fcmp_default)
{
    const other_map = {};
    other.forEach((v,i) => other_map[v] = i + 1);
    return array.sort(function (a, b) {
        const ax = other_map[fn(a)];
        const bx = other_map[fn(b)];
        if (ax && bx) {
            return ax - bx;
        }
        if (ax) {
            return -1;
        }
        if (bx) {
            return 1;
        }
        return fcmp(a, b);
    });
}

module.exports = array_sort_other;


/***/ }),

/***/ "./src/array_sum.js":
/*!**************************!*\
  !*** ./src/array_sum.js ***!
  \**************************/
/***/ ((module) => {

function array_sum(array, fn = Number)
{
    let out = 0;
    array.forEach(function (item) {
        out += fn(item);
    });
    return out;
}

module.exports = array_sum;


/***/ }),

/***/ "./src/array_unique.js":
/*!*****************************!*\
  !*** ./src/array_unique.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const identity = __webpack_require__(/*! ./identity */ "./src/identity.js");

/**
 * Return unique values; if a value occurs multiple times, keep the first one.
 */
function array_unique(values, fn = identity)
{
    const set = new Set();
    return values.filter(function (item) {
        const key = fn(item);
        if (set.has(key)) {
            return false;
        }
        set.add(key);
        return true;
    });
}

module.exports = array_unique;


/***/ }),

/***/ "./src/array_unique_last.js":
/*!**********************************!*\
  !*** ./src/array_unique_last.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const identity = __webpack_require__(/*! ./identity */ "./src/identity.js");

/**
 * Return unique values; if a value occurs multiple times, keep the last one.
 */
function array_unique_last(array, fn = identity)
{
    const out = [];
    const set = new Set();
    for (let i = array.length; --i >= 0; ) {
        const item = array[i];
        const key = fn(item);
        if (!set.has(key)) {
            set.add(key);
            out.push(item);
        }
    }
    return out.reverse();
}

module.exports = array_unique_last;


/***/ }),

/***/ "./src/cli-apps/watchdog.d/ignore_sigterm.js":
/*!***************************************************!*\
  !*** ./src/cli-apps/watchdog.d/ignore_sigterm.js ***!
  \***************************************************/
/***/ (() => {

//#!/usr/bin/env node

// 1️⃣ Client that ignores SIGTERM
// Goal: process stays alive after SIGTERM and only dies on SIGKILL (exactly what pid_kill_grace should handle).
//
// What this tests for watchdog:
//   - watchdog sends SIGTERM → process prints “ignored” and keeps running.
//   - pid_kill_grace waits grace_timeout_ms, sees PID still alive, sends SIGKILL.
//   - Process must die after SIGKILL.
//   - Watchdog should log the whole sequence correctly.
// This is a realistic scenario.

console.log('PID:', process.pid);

// Ignore SIGTERM
process.on('SIGTERM', function () {
    console.log('SIGTERM received, but intentionally ignored');
});

// Still react to SIGINT (Ctrl+C) so you can stop it manually if needed
process.on('SIGINT', function () {
    console.log('SIGINT received, exiting');
    process.exit(130);
});

// Keep process alive
setInterval(() => {
    // simulate work
}, 1000);


/***/ }),

/***/ "./src/cli-apps/watchdog.d/my-ignore-sigterm.js":
/*!******************************************************!*\
  !*** ./src/cli-apps/watchdog.d/my-ignore-sigterm.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

//#!/usr/bin/env node

const Promise = __webpack_require__(/*! bluebird */ "bluebird");
const cli = __webpack_require__(/*! @vbarbarosh/node-helpers/src/cli */ "./src/cli.js");
const now_human = __webpack_require__(/*! @vbarbarosh/node-helpers/src/now_human */ "./src/now_human.js");

cli(main);

async function main()
{
    process.on('SIGTERM', function () {
        console.log(`[${now_human()}][ignore-sigterm] SIGTERM, ignoring...`);
    });
    process.on('SIGINT', function () {
        console.log(`[${now_human()}][ignore-sigterm] SIGINT, ignoring...`);
    });

    for (let iter = 1, last = 100; iter <= last; ++iter) {
        console.log(`[${now_human()}][ignore-sigterm] ${iter} of ${last}`);
        await Promise.delay(100);
    }
}


/***/ }),

/***/ "./src/cli.js":
/*!********************!*\
  !*** ./src/cli.js ***!
  \********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ExitCodeError = __webpack_require__(/*! ./errors/ExitCodeError */ "./src/errors/ExitCodeError.js");
const Promise = __webpack_require__(/*! bluebird */ "bluebird");

/**
 * Entry point for Node CLI apps
 */
function cli(main, report = error => console.error(error))
{
    // https://stackoverflow.com/a/46916601/1478566
    const timer = setInterval(v => v, 1E9);

    Promise.resolve(main()).then(resolve, reject);

    function resolve() {
        clearInterval(timer);
    }
    function reject(error) {
        clearInterval(timer);
        report(error);
        if (error instanceof ExitCodeError) {
            process.exit(error.exit_code);
        }
        else {
            process.exit(1);
        }
    }
}

module.exports = cli;


/***/ }),

/***/ "./src/date_add_hours.js":
/*!*******************************!*\
  !*** ./src/date_add_hours.js ***!
  \*******************************/
/***/ ((module) => {

function date_add_hours(date, hours)
{
    date.setHours(date.getHours() + hours);
    return date;
}

module.exports = date_add_hours;


/***/ }),

/***/ "./src/date_add_milliseconds.js":
/*!**************************************!*\
  !*** ./src/date_add_milliseconds.js ***!
  \**************************************/
/***/ ((module) => {

function date_add_milliseconds(date, milliseconds)
{
    date.setMilliseconds(date.getMilliseconds() + milliseconds);
    return date;
}

module.exports = date_add_milliseconds;


/***/ }),

/***/ "./src/date_add_minutes.js":
/*!*********************************!*\
  !*** ./src/date_add_minutes.js ***!
  \*********************************/
/***/ ((module) => {

function date_add_minutes(date, minutes)
{
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

module.exports = date_add_minutes;


/***/ }),

/***/ "./src/date_add_months.js":
/*!********************************!*\
  !*** ./src/date_add_months.js ***!
  \********************************/
/***/ ((module) => {

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


/***/ }),

/***/ "./src/date_add_seconds.js":
/*!*********************************!*\
  !*** ./src/date_add_seconds.js ***!
  \*********************************/
/***/ ((module) => {

function date_add_seconds(date, seconds)
{
    date.setSeconds(date.getSeconds() + seconds);
    return date;
}

module.exports = date_add_seconds;


/***/ }),

/***/ "./src/date_diff_seconds.js":
/*!**********************************!*\
  !*** ./src/date_diff_seconds.js ***!
  \**********************************/
/***/ ((module) => {

function date_diff_seconds(a, b)
{
    return Math.floor((a.getTime() - b.getTime())/1000);
}

module.exports = date_diff_seconds;


/***/ }),

/***/ "./src/date_is_leap_year.js":
/*!**********************************!*\
  !*** ./src/date_is_leap_year.js ***!
  \**********************************/
/***/ ((module) => {

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


/***/ }),

/***/ "./src/errors/ExitCodeError.js":
/*!*************************************!*\
  !*** ./src/errors/ExitCodeError.js ***!
  \*************************************/
/***/ ((module) => {

class ExitCodeError extends Error
{
    constructor(exit_code, message = '') {
        super(message);
        this.exit_code = exit_code;
    }
}

module.exports = ExitCodeError;


/***/ }),

/***/ "./src/factorize_ms.js":
/*!*****************************!*\
  !*** ./src/factorize_ms.js ***!
  \*****************************/
/***/ ((module) => {

function factorize_ms(v)
{
    const h = Math.floor(v / 3600000);
    const m = Math.floor(v % 3600000 / 60000);
    const s = Math.floor(v % 60000 / 1000);
    const ms = v % 1000;
    return [h, m, s, ms];
}

module.exports = factorize_ms;


/***/ }),

/***/ "./src/fcmp_dates.js":
/*!***************************!*\
  !*** ./src/fcmp_dates.js ***!
  \***************************/
/***/ ((module) => {

function fcmp_dates(a, b)
{
    return a.getTime() - b.getTime();
}

module.exports = fcmp_dates;


/***/ }),

/***/ "./src/fcmp_default.js":
/*!*****************************!*\
  !*** ./src/fcmp_default.js ***!
  \*****************************/
/***/ ((module) => {

function fcmp_default(a, b)
{
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

module.exports = fcmp_default;


/***/ }),

/***/ "./src/fcmp_default_desc.js":
/*!**********************************!*\
  !*** ./src/fcmp_default_desc.js ***!
  \**********************************/
/***/ ((module) => {

function fcmp_default_desc(b, a)
{
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

module.exports = fcmp_default_desc;


/***/ }),

/***/ "./src/fcmp_from_spec.js":
/*!*******************************!*\
  !*** ./src/fcmp_from_spec.js ***!
  \*******************************/
/***/ ((module) => {

/**
 * Create fcmp from an array of props. For desc order a prop should be prefixed
 * with minus sign (e.g. -price).
 *
 * @deprecated Deprecated in favor of fcmpx
 */
function fcmp_from_spec(props)
{
    const fcmp = props.map(one);
    switch (fcmp.length) {
    case 0:
        return () => 0;
    case 1:
        return fcmp[0];
    case 2:
        return function (a, b) {
            return fcmp[0](a, b) || fcmp[1](a, b);
        };
    case 3:
        return function (a, b) {
            return fcmp[0](a, b) || fcmp[1](a, b) || fcmp[2](a, b);
        };
    default:
        return function (a, b) {
            for (let i = 0; i < fcmp.length; ++i) {
                const tmp = fcmp[i](a, b);
                if (tmp) {
                    return tmp;
                }
            }
            return 0;
        };
    }
}

function one(prop)
{
    if (prop[0] === '-') {
        prop = prop.slice(1);
        return function (b, a) {
            return comp_types(a[prop], b[prop]);
        };
    }
    return function (a, b) {
        return comp_types(a[prop], b[prop]);
    };
}

function comp_types(a, b)
{
    if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
    }
    return a - b;
}

module.exports = fcmp_from_spec;


/***/ }),

/***/ "./src/fcmp_numbers.js":
/*!*****************************!*\
  !*** ./src/fcmp_numbers.js ***!
  \*****************************/
/***/ ((module) => {

function fcmp_numbers(a, b)
{
    return a - b;
}

module.exports = fcmp_numbers;


/***/ }),

/***/ "./src/fcmp_tuples.js":
/*!****************************!*\
  !*** ./src/fcmp_tuples.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fcmp_default = __webpack_require__(/*! ./fcmp_default */ "./src/fcmp_default.js");

function fcmp_tuples(a, b, fcmp = fcmp_default)
{
    const end = Math.min(a.length, b.length);
    for (let i = 0; i < end; ++i) {
        const tmp = fcmp(a[i], b[i]);
        if (tmp) {
            return tmp;
        }
    }
    return 0;
}

module.exports = fcmp_tuples;


/***/ }),

/***/ "./src/fcmp_utf8_bin.js":
/*!******************************!*\
  !*** ./src/fcmp_utf8_bin.js ***!
  \******************************/
/***/ ((module) => {

// Strict binary (codepoint) comparison, like MySQL's utf8_bin collation
function fcmp_utf8_bin(a, b)
{
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

module.exports = fcmp_utf8_bin;


/***/ }),

/***/ "./src/fcmp_utf8_ci.js":
/*!*****************************!*\
  !*** ./src/fcmp_utf8_ci.js ***!
  \*****************************/
/***/ ((module) => {

// Locale-aware, case-insensitive, like utf8_ci or utf8mb4_ci
function fcmp_utf8_ci(a, b)
{
    return a.localeCompare(b, undefined, {sensitivity: 'base'});
}

module.exports = fcmp_utf8_ci;


/***/ }),

/***/ "./src/fcmp_utf8_cs.js":
/*!*****************************!*\
  !*** ./src/fcmp_utf8_cs.js ***!
  \*****************************/
/***/ ((module) => {

// Locale-aware, case-sensitive, like utf8_cs or utf8mb4_cs (but using system locale)
function fcmp_utf8_cs(a, b)
{
    return a.localeCompare(b, undefined, {sensitivity: 'variant'});
}

module.exports = fcmp_utf8_cs;


/***/ }),

/***/ "./src/fcmp_utf8_natural_ci.js":
/*!*************************************!*\
  !*** ./src/fcmp_utf8_natural_ci.js ***!
  \*************************************/
/***/ ((module) => {

// Natural sort (numeric), case-insensitive
function fcmp_utf8_natural_ci(a, b)
{
    return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
}

module.exports = fcmp_utf8_natural_ci;


/***/ }),

/***/ "./src/fcmp_utf8_natural_cs.js":
/*!*************************************!*\
  !*** ./src/fcmp_utf8_natural_cs.js ***!
  \*************************************/
/***/ ((module) => {

// Natural sort (numeric), case-sensitive
function fcmp_utf8_natural_cs(a, b)
{
    return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'variant'});
}

module.exports = fcmp_utf8_natural_cs;


/***/ }),

/***/ "./src/fcmpx.js":
/*!**********************!*\
  !*** ./src/fcmpx.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fcmp_default = __webpack_require__(/*! ./fcmp_default */ "./src/fcmp_default.js");
const fcmp_default_desc = __webpack_require__(/*! ./fcmp_default_desc */ "./src/fcmp_default_desc.js");
const identity = __webpack_require__(/*! ./identity */ "./src/identity.js");

const MISSING = Symbol('fcmpx.missing');

/**
 * Comparator builder using compact expressions.
 *
 * fcmp expression — Creates an `fcmp` function from an expression, suitable for use with `[].sort()`.
 *
 * fcmpx('user.email')
 * fcmpx('-user.age,user.email')
 * fcmpx(v => v.user.email)
 * fcmpx(['user.age', 'user.email'])
 * fcmpx(['-user.age', 'user.email'])
 */
function fcmpx(expr)
{
    if (typeof expr === 'string') {
        if (expr.includes(',')) {
            return fcmpx(expr.split(','));
        }
        return fcmpx_compile(expr);
    }
    if (!Array.isArray(expr)) {
        return fcmpx_compile(expr);
    }
    const fcmp_items = expr.map(fcmpx_parse);
    return function (a, b) {
        const tuple1 = fcmp_items.map(v => v.read(a));
        const tuple2 = fcmp_items.map(v => v.read(b));
        for (let i = 0; i < fcmp_items.length; ++i) {
            const tmp = fcmp_items[i].fcmp(tuple1[i], tuple2[i]);
            if (tmp) {
                return tmp;
            }
        }
        return 0;
    };
}

function fcmpx_compile(expr)
{
    const {read, fcmp} = fcmpx_parse(expr);
    return function (a, b) {
        return fcmp(read(a), read(b));
    };
}

function fcmpx_parse(expr)
{
    if (typeof expr === 'function') {
        return {read: fcmpx_compile_read(expr), fcmp: fcmp_wrapper(fcmp_default)};
    }
    if (typeof expr === 'string') {
        const desc = expr.startsWith('-');
        const read = desc ? fcmpx_compile_read(expr.slice(1)) : fcmpx_compile_read(expr);
        const fcmp = fcmp_wrapper(desc ? fcmp_default_desc : fcmp_default);
        return {read, fcmp};
    }
    const fcmp_user = expr.fcmp;
    const read = fcmpx_compile_read(expr.read);
    const desc = expr.desc ?? false;
    const fcmp = fcmp_wrapper(desc ? (fcmp_user ? (b, a) => fcmp_user(a, b) : fcmp_default_desc) : (fcmp_user ?? fcmp_default));
    if (Array.isArray(expr.top)) {
        const priority = new Map(expr.top.map((v, i) => [v, i]));
        return {read: v => priority.get(read(v)) ?? priority.size, fcmp};
    }
    if (Array.isArray(expr.bottom)) {
        const priority = new Map(expr.bottom.map((v, i) => [v, i]));
        return {read: v => priority.get(read(v)) ?? -1, fcmp};
    }
    return {read, fcmp};
}

function fcmpx_compile_read(read)
{
    if (read === undefined || read === '' || read === '.') {
        return identity;
    }
    if (typeof read === 'function') {
        return function (value) {
            return read(value) ?? MISSING;
        };
    }
    if (typeof read === 'string') {
        const props = read.split('.');
        const [a, b, c, d, e] = props;
        switch (props.length) {
        case 1: return v => v?.[a] ?? MISSING;
        case 2: return v => v?.[a]?.[b] ?? MISSING;
        case 3: return v => v?.[a]?.[b]?.[c] ?? MISSING;
        case 4: return v => v?.[a]?.[b]?.[c]?.[d] ?? MISSING;
        case 5: return v => v?.[a]?.[b]?.[c]?.[d]?.[e] ?? MISSING;
        default: return v => props.reduce((a,p) => a?.[p], v) ?? MISSING;
        }
    }
    return v => v?.[read] ?? MISSING;
}

// Sorting rule: Missing values are considered greater than any defined value
// and are therefore placed after all defined values.
function fcmp_wrapper(fcmp)
{
    return function (a, b) {
        if (a === MISSING) {
            if (b === MISSING) {
                return 0;
            }
            return 1;
        }
        if (b === MISSING) {
            return -1;
        }
        return fcmp(a, b);
    };
}

module.exports = fcmpx;


/***/ }),

/***/ "./src/filter1_from_spec.js":
/*!**********************************!*\
  !*** ./src/filter1_from_spec.js ***!
  \**********************************/
/***/ ((module) => {

/**
 * Creates a filtering function based on the following spec:
 * 1. Substrings are separated by `/`.
 * 2. Each substring may have special characters:
 *    - `^`: Substring must appear at the beginning.
 *    - `$`: Substring must appear at the end.
 *    - `!`: Negates the condition (substring must not appear).
 */
function filter1_from_spec(spec)
{
    let a, b, c, d;
    const parts = parse_spec(spec);
    switch (parts.length) {
    case 0:
        // No filters, always true
        return () => true;
    case 1:
        return parts[0];
    case 2:
        [a, b] = parts;
        return s => a(s) && b(s);
    case 3:
        [a, b, c] = parts;
        return s => a(s) && b(s) && c(s);
    case 4:
        [a, b, c, d] = parts;
        return s => a(s) && b(s) && c(s) && d(s);
    default:
        return s => parts.every(fn => fn(s));
    }
}

function parse_spec(spec)
{
    return spec.split('/').filter(v => v).map(parse_expr);
}

// convert expr into an array of objects {substr, starts, ends}
function parse_expr(expr)
{
    let substr;
    let starts = false; // ^
    let ends = false; // $
    substr = expr.replaceAll('^', '');
    starts = (substr.length !== expr.length);
    expr = substr;
    substr = expr.replaceAll('$', '');
    ends = (substr.length !== expr.length);
    expr = substr;
    substr = expr.replaceAll('!', '');
    if ((expr.length - substr.length) % 2) { // not
        if (starts && ends) {
            return s => !s.startsWith(substr) && !s.endsWith(substr);
        }
        if (starts) {
            return s => !s.startsWith(substr);
        }
        if (ends) {
            return s => !s.endsWith(substr);
        }
        return s => !s.includes(substr);
    }
    if (starts && ends) {
        return s => s.startsWith(substr) && s.endsWith(substr);
    }
    if (starts) {
        return s => s.startsWith(substr);
    }
    if (ends) {
        return s => s.endsWith(substr);
    }
    return s => s.includes(substr);
}

module.exports = filter1_from_spec;


/***/ }),

/***/ "./src/format_bytes.js":
/*!*****************************!*\
  !*** ./src/format_bytes.js ***!
  \*****************************/
/***/ ((module) => {

/**
 * @link https://stackoverflow.com/a/18650828
 */
function format_bytes(bytes)
{
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    if (typeof bytes !== 'number' || Number.isNaN(bytes)) {
        return 'n/a';
    }
    if (!bytes) {
        return '0KB';
    }
    if (bytes < 1024) {
        return '1KB';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / (1024 ** i)).toFixed(bytes > 1024*1024 ? 2 : 0)}${sizes[i]}`.replace(/\.00/, '.0');
}

module.exports = format_bytes;

// https://wiki.ubuntu.com/UnitsPolicy
// > Applications must use SI standard for base-10 units:
// >
// > 1 kB = 1,000 bytes (Note: small k)
// > 1 MB = 1,000 kB = 1,000,000 bytes
// > 1 GB = 1,000 MB = 1,000,000 kB = 1,000,000,000 bytes
// > 1 TB = 1,000 GB = 1,000,000 MB = 1,000,000,000 kB = 1,000,000,000,000 bytes


/***/ }),

/***/ "./src/format_date.js":
/*!****************************!*\
  !*** ./src/format_date.js ***!
  \****************************/
/***/ ((module) => {

function format_date(d)
{
    return d.getFullYear() + `/0${d.getMonth()+1}/0${d.getDate()} 0${d.getHours()}:0${d.getMinutes()}:0${d.getSeconds()}`.replace(/0(\d\d)/g, '$1');
}

module.exports = format_date;


/***/ }),

/***/ "./src/format_date_fs.js":
/*!*******************************!*\
  !*** ./src/format_date_fs.js ***!
  \*******************************/
/***/ ((module) => {

function format_date_fs(d)
{
    const ymd = d.getFullYear() + dd(d.getMonth() + 1) + dd(d.getDate());
    const hms = dd(d.getHours()) + dd(d.getMinutes()) + dd(d.getSeconds());
    return ymd + '_' + hms;
}

function dd(v)
{
    return v > 9 ? `${v}` : `0${v}`;
}

module.exports = format_date_fs;


/***/ }),

/***/ "./src/format_date_human.js":
/*!**********************************!*\
  !*** ./src/format_date_human.js ***!
  \**********************************/
/***/ ((module) => {

function format_date_human(d)
{
    const ymd = d.getFullYear() + '/' + dd(d.getMonth() + 1) + '/' + dd(d.getDate());
    const hms = dd(d.getHours()) + ':' + dd(d.getMinutes()) + ':' + dd(d.getSeconds());
    return ymd + ' ' + hms;
}

function dd(v)
{
    return v > 9 ? `${v}` : `0${v}`;
}

module.exports = format_date_human;


/***/ }),

/***/ "./src/format_date_ymd.js":
/*!********************************!*\
  !*** ./src/format_date_ymd.js ***!
  \********************************/
/***/ ((module) => {

function format_date_ymd(d)
{
    return d.getFullYear() + `/0${d.getMonth()+1}/0${d.getDate()}`.replace(/0(\d\d)/g, '$1');
}

module.exports = format_date_ymd;


/***/ }),

/***/ "./src/format_error_report.js":
/*!************************************!*\
  !*** ./src/format_error_report.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const json_stringify_safe = __webpack_require__(/*! ./json_stringify_safe */ "./src/json_stringify_safe.js");

function format_error_report(error)
{
    if (!error) {
        return json_stringify_safe({error: error === undefined ? '---undefined---' : error});
    }

    if (error.response?.status && error.response?.statusText && error.response?.config) {
        return fm_axios_response(error);
    }

    if (error.config) {
        return fm_axios_config(error);
    }

    return json_stringify_safe({
        code: error.code,
        name: error.name,
        message: error.message ?? 'n/a',
        stack: error.stack && error.stack.split(/\n\s*/)
    }, null, 4);
}

function fm_axios_response(error)
{
    return `
${error.message ?? 'n/a'}

--- REQUEST ---

${(error.response.config.method||'').toUpperCase()} ${error.response.config.url}

${JSON.stringify(error.response.config.headers||{}, null, 4).slice(1, -1).replace(/^\s+|,$/mg, '').trim()}

--- RESPONSE ---

${error.response.status} ${error.response.statusText}

${(error.response.data.toString()||'').slice(0, 10240) || 'n/a'}

--- STACK ---

${error.stack ? error.stack.split(/\\n\\s*/) : 'n/a'}
`.trimStart();
}

function fm_axios_config(error)
{
    return `
${error.message ?? 'n/a'}

--- REQUEST ---

${(error.config.method||'').toUpperCase()} ${error.config.url}

${JSON.stringify(error.config.headers||{}, null, 4).slice(1, -1).replace(/^\s+|,$/mg, '').trim()}

--- STACK ---

${error.stack ? error.stack.split(/\\n\\s*/) : 'n/a'}
`.trimStart();
}

module.exports = format_error_report;


/***/ }),

/***/ "./src/format_hrtime.js":
/*!******************************!*\
  !*** ./src/format_hrtime.js ***!
  \******************************/
/***/ ((module) => {

/**
 * Return a human-readable representation of hrtime (the return value from `process.hrtime(hrtime0)`).
 */
function format_hrtime(hrtime, digits = 6)
{
    const [u, v] = hrtime; // process.hrtime(hrtime0)
    return (u + v/1E9).toFixed(digits) + 's';
}

module.exports = format_hrtime;


/***/ }),

/***/ "./src/format_kilo.js":
/*!****************************!*\
  !*** ./src/format_kilo.js ***!
  \****************************/
/***/ ((module) => {

function format_kilo(num)
{
    const sizes = ['', 'K', 'M', 'G', 'T', 'P'];
    if (typeof num !== 'number' || Number.isNaN(num)) {
        return 'n/a';
    }
    if (!num) {
        return '0';
    }
    if (num < 1000) {
        return num.toFixed(0);
    }
    const i = parseInt(Math.floor(Math.log(num) / Math.log(1000)), 10);
    return `${(num / (1000 ** i)).toFixed(2)}${sizes[i]}`;
}

module.exports = format_kilo;


/***/ }),

/***/ "./src/format_ms.js":
/*!**************************!*\
  !*** ./src/format_ms.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const factorize_ms = __webpack_require__(/*! ./factorize_ms */ "./src/factorize_ms.js");

/**
 * Format milliseconds
 */
function format_ms(ms)
{
    if (!ms) {
        ms = 0;
    }

    // 00:05
    const [h, m, s] = factorize_ms(ms);
    if (h) {
        return `0${h}:0${m}:0${s}`.replace(/0+(?=\d\d)/g, '');
    }
    return `0${m}:0${s}`.replace(/0+(?=\d\d)/g, '');
}

module.exports = format_ms;


/***/ }),

/***/ "./src/format_ms2.js":
/*!***************************!*\
  !*** ./src/format_ms2.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const factorize_ms = __webpack_require__(/*! ./factorize_ms */ "./src/factorize_ms.js");

/**
 * Format milliseconds
 */
function format_ms2(ms)
{
    if (!ms) {
        ms = 0;
    }

    // 00:05.45
    const [h, m, s, xx] = factorize_ms(ms);
    if (h) {
        return `0${h}:0${m}:0${s}.0${Math.round(xx/10)}`.replace(/0+(?=\d\d)/g, '');
    }
    return `0${m}:0${s}.0${Math.round(xx/10)}`.replace(/0+(?=\d\d)/g, '');
}

module.exports = format_ms2;


/***/ }),

/***/ "./src/format_ms3.js":
/*!***************************!*\
  !*** ./src/format_ms3.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const factorize_ms = __webpack_require__(/*! ./factorize_ms */ "./src/factorize_ms.js");

/**
 * Format milliseconds
 */
function format_ms3(ms)
{
    if (!ms) {
        ms = 0;
    }

    // 00:05.445
    const [h, m, s, xx] = factorize_ms(ms);
    if (h) {
        return `0${h}:0${m}:0${s}.00${xx}`.replace(/0+(?=\d\d+[:.]|\d\d\d)/g, '');
    }
    return `0${m}:0${s}.00${xx}`.replace(/0+(?=\d\d+[:.]|\d\d\d)/g, '')
}

module.exports = format_ms3;


/***/ }),

/***/ "./src/format_percents.js":
/*!********************************!*\
  !*** ./src/format_percents.js ***!
  \********************************/
/***/ ((module) => {

function format_percents(v)
{
    return (v*100).toFixed(2).replace(/^(0|100).00$/, '$1') + '%';
}

module.exports = format_percents;


/***/ }),

/***/ "./src/format_progress_bytes.js":
/*!**************************************!*\
  !*** ./src/format_progress_bytes.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const format_bytes = __webpack_require__(/*! ./format_bytes */ "./src/format_bytes.js");
const format_percents = __webpack_require__(/*! ./format_percents */ "./src/format_percents.js");
const format_seconds = __webpack_require__(/*! ./format_seconds */ "./src/format_seconds.js");
const is_num_gt = __webpack_require__(/*! @vbarbarosh/type-helpers/src/is_num_gt */ "./node_modules/@vbarbarosh/type-helpers/src/is_num_gt.js");

function format_progress_bytes({percents, total, done, rate, eta, duration})
{
    const bps = is_num_gt(rate, 0) ? `${format_bytes(rate)}/s` : '~';
    if (done > total) {
        return `${format_bytes(done)} at ${bps} duration=${format_seconds(duration)}`;
    }
    if (is_num_gt(total, 0)) {
        const eta_str = is_num_gt(eta, 0) ? format_seconds(eta) : '~';
        return `${format_percents(percents)} | ${format_bytes(done)} of ${format_bytes(total)} at ${bps} ETA ${eta_str} duration=${format_seconds(duration)}`;
    }
    if (is_num_gt(done, 0)) {
        return `${format_bytes(done)} of ~ at ${bps} duration=${format_seconds(duration)}`;
    }
    if (is_num_gt(duration, 0)) {
        return `~ duration=${format_seconds(duration)}`;
    }
    return '~';
}

module.exports = format_progress_bytes;


/***/ }),

/***/ "./src/format_progress_kilo.js":
/*!*************************************!*\
  !*** ./src/format_progress_kilo.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const format_kilo = __webpack_require__(/*! ./format_kilo */ "./src/format_kilo.js");
const format_percents = __webpack_require__(/*! ./format_percents */ "./src/format_percents.js");
const format_seconds = __webpack_require__(/*! ./format_seconds */ "./src/format_seconds.js");
const is_num_gt = __webpack_require__(/*! @vbarbarosh/type-helpers/src/is_num_gt */ "./node_modules/@vbarbarosh/type-helpers/src/is_num_gt.js");

function format_progress_kilo({percents, total, done, rate, eta, duration})
{
    const speed = is_num_gt(rate, 0) ? `${format_kilo(rate)}/s` : '~';
    if (done > total) {
        return `${format_kilo(done)} at ${speed} duration=${format_seconds(duration)}`;
    }
    if (is_num_gt(total, 0)) {
        const eta_str = is_num_gt(eta, 0) ? format_seconds(eta) : '~';
        return `${format_percents(percents)} | ${format_kilo(done)} of ${format_kilo(total)} at ${speed} ETA ${eta_str} duration=${format_seconds(duration)}`;
    }
    if (is_num_gt(done, 0)) {
        return `${format_kilo(done)} of ~ at ${speed} duration=${format_seconds(duration)}`;
    }
    if (is_num_gt(duration, 0)) {
        return `~ duration=${format_seconds(duration)}`;
    }
    return '~';
}

module.exports = format_progress_kilo;


/***/ }),

/***/ "./src/format_seconds.js":
/*!*******************************!*\
  !*** ./src/format_seconds.js ***!
  \*******************************/
/***/ ((module) => {

function format_seconds(seconds)
{
    const v = Math.abs(Math.trunc(seconds));
    const hh = Math.floor(v / 60 / 60);
    const mm = Math.floor(v / 60) % 60;
    const ss = v % 60;
    const tmp = `0${hh}:0${mm}:0${ss}`.replace(/0(\d\d)/g, '$1');
    return (seconds <= -1) ? ('-' + tmp) : tmp;
}

module.exports = format_seconds;


/***/ }),

/***/ "./src/format_thousands.js":
/*!*********************************!*\
  !*** ./src/format_thousands.js ***!
  \*********************************/
/***/ ((module) => {

// https://stackoverflow.com/a/2901298
function format_thousands(x)
{
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

module.exports = format_thousands;


/***/ }),

/***/ "./src/http_delete.js":
/*!****************************!*\
  !*** ./src/http_delete.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

function http_delete(url, options)
{
    return axios.delete(url, {responseType: 'json', ...options}).then(v => v.data);
}

module.exports = http_delete;


/***/ }),

/***/ "./src/http_get_blob.js":
/*!******************************!*\
  !*** ./src/http_get_blob.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

function http_get_blob(url, options)
{
    return axios.get(url, {responseType: 'blob', ...options}).then(v => v.data);
}

module.exports = http_get_blob;


/***/ }),

/***/ "./src/http_get_buffer.js":
/*!********************************!*\
  !*** ./src/http_get_buffer.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

function http_get_buffer(url, options)
{
    return axios.get(url, {responseType: 'arraybuffer', ...options}).then(v => v.data);
}

module.exports = http_get_buffer;


/***/ }),

/***/ "./src/http_get_json.js":
/*!******************************!*\
  !*** ./src/http_get_json.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

function http_get_json(url, options)
{
    return axios.get(url, {responseType: 'json', ...options}).then(v => v.data);
}

module.exports = http_get_json;


/***/ }),

/***/ "./src/http_get_utf8.js":
/*!******************************!*\
  !*** ./src/http_get_utf8.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

function http_get_utf8(url, options)
{
    return axios.get(url, {responseType: 'text', responseEncoding: 'utf8', ...options}).then(v => v.data);
}

module.exports = http_get_utf8;


/***/ }),

/***/ "./src/http_head.js":
/*!**************************!*\
  !*** ./src/http_head.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

function http_head(url, options)
{
    return axios.head(url, options).then(v => v.request.res.headers);
}

module.exports = http_head;


/***/ }),

/***/ "./src/http_patch_json.js":
/*!********************************!*\
  !*** ./src/http_patch_json.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

function http_patch_json(url, body, options)
{
    return axios.patch(url, body, options).then(v => v.data);
}

module.exports = http_patch_json;


/***/ }),

/***/ "./src/http_post_json.js":
/*!*******************************!*\
  !*** ./src/http_post_json.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

function http_post_json(url, body, options)
{
    return axios.post(url, body, options).then(v => v.data);
}

module.exports = http_post_json;


/***/ }),

/***/ "./src/http_post_multipart.js":
/*!************************************!*\
  !*** ./src/http_post_multipart.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const FormData = __webpack_require__(/*! form-data */ "form-data");
const axios = __webpack_require__(/*! axios */ "axios");

// Provide examples for the following common tasks:
//
// * send plain text
// * send json
// * send image
// * send attachment

// import fetch from 'node-fetch';
//
// async function http_post_multipart(url, rows)
// {
//     const form = new FormData();
//     for (let i = 0, end = rows.length; i < end; ++i) {
//         const {name, body} = rows[i];
//         form.append(name, body);
//     }
//     return await fetch(url, {method: 'POST', body: form});
// }
//
// Example:
//
// const rows = [];
// rows.push({name: 'from', body: MAILGUN_FROM});
// rows.push({name: 'to', body: to});
// rows.push({name: 'subject', body: subject});
// rows.push({name: 'text', body: text});
// rows.push({name: 'attachment', body: fs_read_stream(__filename), options: {filename: 'hello.txt'}});
// return http_post_multipart(`${MAILGUN_BASE}/messages`, rows, options);

// https://github.com/axios/axios/issues/318#issuecomment-344620216
// https://github.com/axios/axios/issues/1006#issuecomment-320165427
function http_post_multipart(url, items, options)
{
    const form = new FormData();
    for (let i = 0, end = items.length; i < end; ++i) {
        const item = items[i];
        // Without this, all string vales (ordinary fields) will
        // be empty in _Chrome 59.0.3071.86 (Official Build) (64-bit)_
        if (item.options) {
            form.append(item.name, item.body, item.options);
        }
        else {
            form.append(item.name, item.body);
        }
    }
    // For Node
    // import FormData from 'form-data'
    // noinspection JSUnresolvedVariable
    if (form.getHeaders) {
        const options2 = {...options};
        options2.headers = {...options2.headers, ...form.getHeaders()};
        return Promise.resolve(axios.post(url, form, options2)).then(v => v.data);
    }
    // For Browser
    // webpack.config.js
    //   externals: {"form-data": "FormData"}
    return Promise.resolve(axios.post(url, form, options)).then(v => v.data);
}

module.exports = http_post_multipart;


/***/ }),

/***/ "./src/http_put_buffer.js":
/*!********************************!*\
  !*** ./src/http_put_buffer.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

function http_put_buffer(url, body, options)
{
    return axios.put(url, body, options).then(v => v.data);
}

module.exports = http_put_buffer;


/***/ }),

/***/ "./src/http_put_json.js":
/*!******************************!*\
  !*** ./src/http_put_json.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

function http_put_json(url, body, options)
{
    return axios.put(url, body, options).then(v => v.data);
}

module.exports = http_put_json;


/***/ }),

/***/ "./src/http_put_utf8.js":
/*!******************************!*\
  !*** ./src/http_put_utf8.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const axios = __webpack_require__(/*! axios */ "axios");

async function http_put_utf8(url, utf8, options)
{
    return axios.put(url, utf8, options).then(v => v.data);
}

module.exports = http_put_utf8;


/***/ }),

/***/ "./src/identity.js":
/*!*************************!*\
  !*** ./src/identity.js ***!
  \*************************/
/***/ ((module) => {

function identity(value)
{
    return value;
}

module.exports = identity;


/***/ }),

/***/ "./src/ignore.js":
/*!***********************!*\
  !*** ./src/ignore.js ***!
  \***********************/
/***/ ((module) => {

function ignore()
{
}

module.exports = ignore;


/***/ }),

/***/ "./src/json_stringify_safe.js":
/*!************************************!*\
  !*** ./src/json_stringify_safe.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const json_stringify_safe = __webpack_require__(/*! json-stringify-safe */ "./node_modules/json-stringify-safe/stringify.js");

module.exports = json_stringify_safe;


/***/ }),

/***/ "./src/math_gcd.js":
/*!*************************!*\
  !*** ./src/math_gcd.js ***!
  \*************************/
/***/ ((module) => {

// https://stackoverflow.com/a/39764792/1478566
function math_gcd(a, b)
{
    if (b) {
        return math_gcd(b, a % b);
    }
    return a;
}

module.exports = math_gcd;


/***/ }),

/***/ "./src/math_lcm.js":
/*!*************************!*\
  !*** ./src/math_lcm.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const math_gcd = __webpack_require__(/*! ./math_gcd */ "./src/math_gcd.js");

function math_lcm(a, b)
{
    return Math.abs(a*b) / math_gcd(a, b);
}

module.exports = math_lcm;


/***/ }),

/***/ "./src/now_human.js":
/*!**************************!*\
  !*** ./src/now_human.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const format_date_human = __webpack_require__(/*! ./format_date_human */ "./src/format_date_human.js");

function now_human()
{
    return format_date_human(new Date());
}

module.exports = now_human;


/***/ }),

/***/ "./src/pid_kill_grace.d/ignore-sigterm-for-10ms.js":
/*!*********************************************************!*\
  !*** ./src/pid_kill_grace.d/ignore-sigterm-for-10ms.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

//#!/usr/bin/env node

const Promise = __webpack_require__(/*! bluebird */ "bluebird");
const cli = __webpack_require__(/*! ../cli */ "./src/cli.js");
const now_human = __webpack_require__(/*! ../now_human */ "./src/now_human.js");

// Child ignores SIGTERM for 10 ms, but dies naturally before the grace loop ends

cli(main);

async function main()
{
    let timer;

    process.on('SIGTERM', function () {
        console.log(`[${now_human()}][ignore-sigterm-for-10ms] SIGTERM_ignoring...`);
        timer ??= setTimeout(terminate, 10);
    });
    process.on('SIGINT', function () {
        console.log(`[${now_human()}][ignore-sigterm-for-10ms] SIGINT_ignoring...`);
    });

    for (let iter = 1, last = 100; iter <= last; ++iter) {
        console.log(`[${now_human()}][ignore-sigterm-for-10ms] ${iter} of ${last}`);
        await Promise.delay(10);
    }
}

function terminate()
{
    console.log(`[${now_human()}][ignore-sigterm-for-10ms] TERMINATE_AFTER_10MS`);
    process.exit(0);
}


/***/ }),

/***/ "./src/pid_kill_grace.d/ignore-sigterm.js":
/*!************************************************!*\
  !*** ./src/pid_kill_grace.d/ignore-sigterm.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

//#!/usr/bin/env node

const Promise = __webpack_require__(/*! bluebird */ "bluebird");
const cli = __webpack_require__(/*! ../cli */ "./src/cli.js");
const now_human = __webpack_require__(/*! ../now_human */ "./src/now_human.js");

cli(main);

async function main()
{
    process.on('SIGTERM', function () {
        console.log(`[${now_human()}][ignore-sigterm] SIGTERM_ignoring...`);
    });
    process.on('SIGINT', function () {
        console.log(`[${now_human()}][ignore-sigterm] SIGINT_ignoring...`);
    });

    for (let iter = 1, last = 100; iter <= last; ++iter) {
        console.log(`[${now_human()}][ignore-sigterm] ${iter} of ${last}`);
        await Promise.delay(10);
    }
}


/***/ }),

/***/ "./src/plural.js":
/*!***********************!*\
  !*** ./src/plural.js ***!
  \***********************/
/***/ ((module) => {

function plural(n, singular, plural, zero)
{
    if (n === 0 && typeof zero === 'string') {
        return zero;
    }
    if (n % 10 === 1 && n % 100 !== 11) {
        return singular.split('#').join(n);
    }
    return plural.split('#').join(n);
}

module.exports = plural;


/***/ }),

/***/ "./src/random_int.js":
/*!***************************!*\
  !*** ./src/random_int.js ***!
  \***************************/
/***/ ((module) => {

function random_int(min, max)
{
    return Math.floor(Math.random()*(max - min + 1) + min);
}

module.exports = random_int;


/***/ }),

/***/ "./src/urlmod.js":
/*!***********************!*\
  !*** ./src/urlmod.js ***!
  \***********************/
/***/ ((module) => {

/**
 * Set, change, or remove query string parameters.
 *
 * urlmod('', {a: 1})           '?a=1'  set
 * urlmod('?a=1', {a: 2})       '?a=2'  change
 * urlmod('?a=1', {a: null})    ''      remove
 */
function urlmod(url, params)
{
    const tmp_url = new URL(url||'', 'xxx://___base___/');
    const tmp_search = tmp_url.searchParams;
    Object.entries(params || {}).forEach(function ([key, value]) {
        switch (value) {
        case null:
        case undefined:
            tmp_search.delete(key);
            break;
        case true:
            tmp_search.set(key, 1);
            break;
        case false:
            tmp_search.set(key, 0);
            break;
        default:
            tmp_search.set(key, value);
            break;
        }
    });
    if (url && url[0] === '/') {
        return tmp_url.toString().replace(/^xxx:\/\/___base___/, '');
    }
    return tmp_url.toString().replace(/^xxx:\/\/___base___\//, '');
}

module.exports = urlmod;


/***/ }),

/***/ "./src/waitcb.js":
/*!***********************!*\
  !*** ./src/waitcb.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Promise = __webpack_require__(/*! bluebird */ "bluebird");

/**
 * Wait for a Node-like function to finish (which will call `callback`
 * with 2 arguments: `error` and `value`).
 *
 * await waitcb(cb => fs.writeFile('a', 'hello\n', cb));
 */
function waitcb(fn)
{
    return new Promise(function (resolve, reject) {
        fn(function (error, out) {
            error ? reject(error) : resolve(out);
        });
    });
}

module.exports = waitcb;


/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = axios;

/***/ }),

/***/ "bluebird":
/*!**************************!*\
  !*** external "Promise" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = Promise;

/***/ }),

/***/ "form-data":
/*!***************************!*\
  !*** external "FormData" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = FormData;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/browser/index.js ***!
  \******************************/
const ns = new URL(document.currentScript.src).searchParams.get('var') ?? 'h';
if (typeof window[ns] !== 'undefined') {
    console.log(`❌ @vbarbarosh/node-helpers@${"3.72.4"} was not injected — window.${ns} is already in use`);
}
else {
    console.log(`🎉 @vbarbarosh/node-helpers@${"3.72.4"} successfully exposed as window.${ns}`);
    window[ns] = {};
    // https://github.com/webpack/webpack/issues/625
    // https://webpack.js.org/guides/dependency-management/#require-context
    const require_tmp = __webpack_require__("./src sync recursive \\b(array%7Cdate%7Chttp_delete%7Chttp_get_blob%7Chttp_get_buffer%7Chttp_get_json%7Chttp_get_utf8%7Chttp_head%7Chttp_patch_json%7Chttp_post_json%7Chttp_post_multipart%7Chttp_put_buffer%7Chttp_put_json%7Chttp_put_utf8%7Cidentity%7Cignore%7Cfcmp%7Cfilter%7Cformat%7Cplural%7Crandom_int%7Curlmod%7Cwaitcb)[^/]*(?<%21\\.test)\\.js$");
    require_tmp.keys().forEach(function (key) {
        const [, basename] = key.match(/([^/]+)\.js$/);
        window[ns][basename] = require_tmp(key);
    });
}

})();

/******/ })()
;