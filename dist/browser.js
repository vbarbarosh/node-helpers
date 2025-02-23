/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src sync recursive \\b(array%7Cdate%7Chttp_delete%7Chttp_get_blob%7Chttp_get_buffer%7Chttp_get_json%7Chttp_get_utf8%7Chttp_head%7Chttp_patch_json%7Chttp_post_json%7Chttp_post_multipart%7Chttp_put_buffer%7Chttp_put_json%7Chttp_put_utf8%7Cidentity%7Cignore).*(?<%21\\.test)\\.js$":
/*!***********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./src/ sync \b(array%7Cdate%7Chttp_delete%7Chttp_get_blob%7Chttp_get_buffer%7Chttp_get_json%7Chttp_get_utf8%7Chttp_head%7Chttp_patch_json%7Chttp_post_json%7Chttp_post_multipart%7Chttp_put_buffer%7Chttp_put_json%7Chttp_put_utf8%7Cidentity%7Cignore).*(?<%21\.test)\.js$ ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./array_chunk.js": "./src/array_chunk.js",
	"./array_gcd.js": "./src/array_gcd.js",
	"./array_group.js": "./src/array_group.js",
	"./array_group_map.js": "./src/array_group_map.js",
	"./array_index.js": "./src/array_index.js",
	"./array_max.js": "./src/array_max.js",
	"./array_min.js": "./src/array_min.js",
	"./array_permutations.js": "./src/array_permutations.js",
	"./array_shuffle.js": "./src/array_shuffle.js",
	"./array_sort.js": "./src/array_sort.js",
	"./array_sort_other.js": "./src/array_sort_other.js",
	"./array_sum.js": "./src/array_sum.js",
	"./array_unique.js": "./src/array_unique.js",
	"./array_unique_last.js": "./src/array_unique_last.js",
	"./date_add_months.js": "./src/date_add_months.js",
	"./date_is_leap_year.js": "./src/date_is_leap_year.js",
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
	"./ignore.js": "./src/ignore.js"
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
webpackContext.id = "./src sync recursive \\b(array%7Cdate%7Chttp_delete%7Chttp_get_blob%7Chttp_get_buffer%7Chttp_get_json%7Chttp_get_utf8%7Chttp_head%7Chttp_patch_json%7Chttp_post_json%7Chttp_post_multipart%7Chttp_put_buffer%7Chttp_put_json%7Chttp_put_utf8%7Cidentity%7Cignore).*(?<%21\\.test)\\.js$";

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
/***/ ((module) => {

// https://stackoverflow.com/a/39764792/1478566
function array_gcd(array, fn = Number)
{
    return array.reduce((a,b) => gcd(fn(a), fn(b)));
}

// https://stackoverflow.com/a/39764792/1478566
function gcd(a, b)
{
    if (b) {
        return gcd(b, a % b);
    }
    return a;
}

module.exports = array_gcd;


/***/ }),

/***/ "./src/array_group.js":
/*!****************************!*\
  !*** ./src/array_group.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const array_group_map = __webpack_require__(/*! ./array_group_map */ "./src/array_group_map.js");

/**
 * Group items by common key and return an array of groups.
 *
 * @param array
 * @param fn
 * @returns {unknown[]}
 */
function array_group(array, fn)
{
    return Object.values(array_group_map(array, fn));
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
/***/ ((module) => {

/**
 * Usage:
 *     array_index(items, v => v.name)
 *
 * Seems, there is a native way to do it:
 *     Object.fromEntries(items.map(v => [v.name, v]));
 */
function array_index(array, fn)
{
    const out = {};
    array.forEach(v => out[fn(v)] = v);
    return out;
}

module.exports = array_index;


/***/ }),

/***/ "./src/array_max.js":
/*!**************************!*\
  !*** ./src/array_max.js ***!
  \**************************/
/***/ ((module) => {

/**
 * Return first among maximum values.
 *
 * @param array
 * @param fn
 */
function array_max(array, fn = identity)
{
    let out = null;
    let out_value = null;
    array.forEach(function (item) {
        const item_value = fn(item);
        if (item_value > out_value || out_value === null) {
            out = item;
            out_value = item_value;
        }
    });
    return out;
}

function identity(value)
{
    return value;
}

module.exports = array_max;


/***/ }),

/***/ "./src/array_min.js":
/*!**************************!*\
  !*** ./src/array_min.js ***!
  \**************************/
/***/ ((module) => {

/**
 * Return first among minimum values.
 *
 * @param array
 * @param fn
 */
function array_min(array, fn = identity)
{
    let out = null;
    let out_value = null;
    array.forEach(function (item) {
        const item_value = fn(item);
        if (item_value < out_value || out_value === null) {
            out = item;
            out_value = item_value;
        }
    });
    return out;
}

function identity(value)
{
    return value;
}

module.exports = array_min;


/***/ }),

/***/ "./src/array_permutations.js":
/*!***********************************!*\
  !*** ./src/array_permutations.js ***!
  \***********************************/
/***/ ((module) => {

// https://stackoverflow.com/a/37580979/23502239
function array_permutations(array)
{
    var length = array.length,
        out = [array.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = array[i];
            array[i] = array[k];
            array[k] = p;
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

const fcmp_strings = __webpack_require__(/*! ./fcmp_strings */ "./src/fcmp_strings.js");

/**
 * Sort items in an `array`.
 *
 * @param array
 * @param fn
 * @param fcmp
 * @returns {*}
 */
function array_sort(array, fn = identity, fcmp = fcmp_strings)
{
    return array.sort(function (a, b) {
        return fcmp(fn(a), fn(b));
    });
}

function identity(v)
{
    return v;
}

module.exports = array_sort;


/***/ }),

/***/ "./src/array_sort_other.js":
/*!*********************************!*\
  !*** ./src/array_sort_other.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fcmp_strings = __webpack_require__(/*! ./fcmp_strings */ "./src/fcmp_strings.js");

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
function array_sort_other(array, fn, other, fcmp = fcmp_strings)
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
/***/ ((module) => {

function array_unique(values)
{
    const set = new Set();
    return values.filter(function (item) {
        if (set.has(item)) {
            return false;
        }
        set.add(item);
        return true;
    });
}

module.exports = array_unique;


/***/ }),

/***/ "./src/array_unique_last.js":
/*!**********************************!*\
  !*** ./src/array_unique_last.js ***!
  \**********************************/
/***/ ((module) => {

/**
 * Return only unique values. If there are many values - prefer last one.
 *
 * @param array
 * @param fn
 * @returns {*[]}
 */
function array_unique_last(array, fn = identity)
{
    const out = [];
    const taken = {};
    for (let i = array.length; --i >= 0; ) {
        const item = array[i];
        const pk = fn(item);
        if (!taken[pk]) {
            taken[pk] = true;
            out.push(item);
        }
    }
    return out.reverse();
}

function identity(value)
{
    return value;
}

module.exports = array_unique_last;


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

/***/ "./src/fcmp_strings.js":
/*!*****************************!*\
  !*** ./src/fcmp_strings.js ***!
  \*****************************/
/***/ ((module) => {

function fcmp_strings(a, b)
{
    return String(a).localeCompare(b);
}

module.exports = fcmp_strings;


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

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = axios;

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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/browser/index.js ***!
  \******************************/
// https://github.com/webpack/webpack/issues/625
// https://webpack.js.org/guides/dependency-management/#require-context
const require_tmp = __webpack_require__("./src sync recursive \\b(array%7Cdate%7Chttp_delete%7Chttp_get_blob%7Chttp_get_buffer%7Chttp_get_json%7Chttp_get_utf8%7Chttp_head%7Chttp_patch_json%7Chttp_post_json%7Chttp_post_multipart%7Chttp_put_buffer%7Chttp_put_json%7Chttp_put_utf8%7Cidentity%7Cignore).*(?<%21\\.test)\\.js$");
require_tmp.keys().forEach(function (key) {
    const [, basename] = key.match(/([^/]+)\.js$/);
    window[basename] = require_tmp(key);
});

})();

/******/ })()
;