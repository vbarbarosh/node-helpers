A set of helpers for JavaScript/Node.js

<p align="center">
<a href="https://github.com/vbarbarosh/node-helpers/actions"><img src="https://github.com/vbarbarosh/node-helpers/actions/workflows/node.js.yml/badge.svg" alt="@vbarbarosh/node-helpers CI status" /></a>
<a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/vbarbarosh/node-helpers" alt="License" /></a>
<a href="https://www.npmjs.com/package/@vbarbarosh/node-helpers" rel="nofollow"><img src="https://img.shields.io/npm/dw/@vbarbarosh/node-helpers.svg" alt="npm" /></a>
<a href="https://github.com/vbarbarosh/node-helpers" rel="nofollow"><img src="https://img.shields.io/github/stars/vbarbarosh/node-helpers" alt="stars" /></a>
</p>

<p align="center">
<img src="docs/img/node-helpers-by-chat-gpt.webp" style="max-height:400px;" />
</p>

## Installation

```sh
npm install @vbarbarosh/node-helpers
```

A subset of `@vbarbarosh/node-helpers` is available for browser:

```html
<script src="https://unpkg.com/@vbarbarosh/node-helpers@3.72.2/dist/browser.js"></script>
```

⚠️ All browser functions are exposed globally.

## Test

```sh
bin/test
```

## 📖 Conventions

`concurrency` - limit for parallel processes.

`user_friendly_status` - a function that accepts a string ready to present for the end-user (i.e.
string which is guaranteed contains no sensitive information like usernames or passwords).

* [Node • Stream • readable.every](https://nodejs.org/api/stream.html#readableeveryfn-options)
* [Node • Stream • readable.filter](https://nodejs.org/api/stream.html#readablefilterfn-options)
* [Node • Stream • readable.find](https://nodejs.org/api/stream.html#readablefindfn-options)
* [Node • Stream • readable.flatMap](https://nodejs.org/api/stream.html#readableflatmapfn-options)
* [Node • Stream • readable.forEach](https://nodejs.org/api/stream.html#readableforeachfn-options)
* [Node • Stream • readable.map](https://nodejs.org/api/stream.html#readablemapfn-options)
* [Node • Stream • readable.some](https://nodejs.org/api/stream.html#readablesomefn-options)
* [bluebird • Promise.map](http://bluebirdjs.com/docs/api/promise.map.html)
