#!/usr/bin/env node

/**
 * build.js
 *
 * @copyright 2025 Michael Welter <me@mikinho.com>
 * @license MIT
 */

const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

const srcPath = path.join(__dirname, "../src/active-links.js");
const distPath = path.join(__dirname, "../dist/active-links.js");

// Ensure dist folder exists
if (!fs.existsSync(path.dirname(distPath))) {
    fs.mkdirSync(path.dirname(distPath));
}

// Read Source
let content = fs.readFileSync(srcPath, "utf8");

// Inject Version
console.log(`Injecting version ${pkg.version}...`);
content = content.replace(/__VERSION__/g, pkg.version);

// Write to dist/active-links.js
fs.writeFileSync(distPath, content);