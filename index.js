/**
 * Module dependencies
 */

const fs   = require('fs');
const path   = require('path');
const lookup = require('look-up');
const read   = require('read-data');
const extend = require('extend-shallow');

// Defaults
const pkg = lookup('package.json', { cwd: process.cwd() });
const cwd = path.dirname(pkg);
const env = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

// Path variables
const home     = path.resolve.bind(path, env);
const localFn = path.resolve.bind(path, cwd);
const npmFn   = path.resolve.bind(path, cwd, 'node_modules');

/**
 * Expose `config`
 */

var config = module.exports;

/**
 * Searches for a config file, first
 * in the local project then in the
 * user's home directory.
 *
 * ```js
 * var filepath = config.find('.jshintrc');
 * ```
 * @param   {String} `filepath` Filepath to find
 * @param   {Object} `options` Additional options to use when finding a file.
 * @returns {String} filepath to config file
 * @api public
 */

config.find = function(filepath, options) {
  if (typeof filepath === 'object') {
    options = filepath;
    filepath = null;
  }

  var opts = options || {};
  var basename = filepath ? path.basename(filepath) : '';
  var local = localFn;

  if (typeof opts.cwd !== 'undefined') {
    local = path.resolve.bind(path, opts.cwd);
  }

  var fp = local(filepath || 'package.json');
  if (fs.existsSync(fp)) {
    return fp;
  }

  fp = home(basename);
  if (fs.existsSync(fp)) {
    return fp;
  }
  return null;
};

/**
 * Parses JSON or YAML
 *
 * ```js
 * var obj = config.load('.jshintrc', {parse: 'yaml'});
 * ```
 * @param {String} `basename` The name of the file to parse
 * @param {Object} `options` Optionally specify `{parse:'json'}` or `{parse:'yaml'}`
 * @return {Object}
 * @api public
 */

config.load = function(basename, options) {
  var opts = options || {};

  // If no filepath is specified, config.find will
  // automatically load 'package.json'
  var fp = config.find(basename, opts);
  try {
    return read.data.sync(fp, opts);
  } catch (err) {}
  return null;
};

/**
 * Searches for a config file in the specified npm module.
 *
 * @param   {String} `name` Name of npm module to search
 * @param   {String} `filename` Config file name. package.json is the default
 * @param   {Object} `options` Parse options. See config.load
 * @returns {Object} config object
 * @api public
 */

config.npmLoad = function(moduleName, filename, options) {
  if (typeof filename === 'object') {
    options = filename;
    filename = null;
  }

  var opts = extend({parse: 'json'}, options);
  var npm = npmFn;

  if (typeof opts.cwd !== 'undefined') {
    npm = path.resolve.bind(path, opts.cwd, 'node_modules');
  }

  filename = filename || 'package.json';
  var fp = path.join(npm(moduleName), filename);

  if (!fs.existsSync(fp)) {
    return null;
  }

  try {
    return read.data.sync(fp, opts);
  } catch (err) {}
  return null;
};
