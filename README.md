# Active Links JS

![NPM Version](https://img.shields.io/npm/v/active-links?style=flat-square)
![GitHub Release](https://img.shields.io/github/v/release/mikinho/active-links?style=flat-square)
![File Size](https://img.shields.io/github/size/mikinho/active-links/dist/active-links.min.js?style=flat-square&label=minified%20size)
![License](https://img.shields.io/github/license/mikinho/active-links?style=flat-square)

A lightweight, high-performance script that automatically adds `is-active` and `is-ancestor` classes to your navigation links.

## Features
* **Fast**: Uses `document.links`, cached loops, and skips non-HTTP protocols.
* **Smart**: Handles query strings (`?a=1&b=2` == `?b=2&a=1`) and normalizes trailing slashes.
* **Zero Dependencies**: Drop it in and it works.

## Installation & Usage

### Option 1: CDN (Easiest)
Place this at the end of your `<body>` tag:

```html
<script src="[https://cdn.jsdelivr.net/gh/mikinho/active-links@1.0.0/dist/active-links.min.js](https://cdn.jsdelivr.net/gh/mikinho/active-links@1.0.0/dist/active-links.min.js)" defer></script>
```

### Option 2: NPM

```bash
npm install active-links
```

#### Usage with Fastify

```JavaScript
const path = require("node:path");
const fastify = require("fastify")();

fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "node_modules/active-links/dist"),
    prefix: "/s/js/",
    decorateReply: false
});
```

#### Usage with Express

```JavaScript
const express = require("express");
const app = express();
const path = require("path");

app.use("/vendor/js", express.static(path.join(__dirname, "node_modules/active-links/dist")));
```