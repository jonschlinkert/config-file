# config-file [![NPM version](https://badge.fury.io/js/config-file.png)](http://badge.fury.io/js/config-file)

> Find and load a YAML or JSON config file from a local project, installed npm module, or the user's home directory.

## Installation

**Install with [npm](npmjs.org)**:

```bash
npm i config-file --save
```

## Usage

```js
var config = require('config-file');
```

## config.load

```js
config.load('.whateverrc'); // assumes JSON
config.load('.whateverrc', {parse: 'yaml'});
```

### config.npmLoad

```js
config.npmLoad('foo'); // npm module name
config.npmLoad('foo', 'package.json'); // default is package.json, can be anything
config.npmLoad('foo', '.whatever.yml.', {parse: 'yaml'});
```

## Authors

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright (c) 2014 [Jon Schlinkert](http://twitter.com/jonschlinkert), contributors.
Released under the [MIT license](./LICENSE-MIT)