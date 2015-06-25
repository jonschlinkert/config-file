/**
 * config-file <https://github.com/jonschlinkert/config-file>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

// Dependencies
const path   = require('path');
const file   = require('fs-utils');
const findup = require('findup-sync');
const _      = require('lodash');


// Defaults
const pkg    = findup('package.json', {cwd: process.cwd()});
const cwd    = path.dirname(pkg);
const env    = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

// Path variables
const home   = path.resolve.bind(path, env, '');
const defLocal  = path.resolve.bind(path, cwd, '');
const defNpm    = path.resolve.bind(path, cwd, 'node_modules');


/**
 * Export `config`
 */

var config = module.exports = {};


/**
 * Searches for a config file, first
 * in the local project then in the
 * user's home directory.
 *
 * @param   {String}
 * @returns {String} filepath to config file
 */

config.find = function(filepath, options) {
  if (typeof filepath === 'object') {
    options = filepath;
    filepath = null;
  }
  var opts = options || {};

  var filename = path.basename(filepath);
  var local = defLocal;

  if (typeof opts.cwd !== 'undefined') {
    local = path.resolve.bind(path, opts.cwd, '');
  }

  if(file.findFile(local(filepath || 'package.json')) !== null) {
    return file.findFile(local(filepath || 'package.json'));
  } else if (file.findFile(home(filename)) !== null) {
    return file.findFile(home(filename));
  } else {
    return;
  }
};


/**
 * Parses JSON or YAML
 *
 * @param   {String} filename The name of the file to parse
 * @param   {Object} options {parse:'json'} or {parse:'yaml'}
 *
 * @return  {Object}
 * @api Public
 */

config.load = function(filename, options) {
  var opts = options || {};

  // If no filename is specified, config.find will
  // automatically load 'package.json'
  var configfile = config.find(filename, opts);
  try {
    return file.readDataSync(configfile, opts);
  } catch(e) {
    // console.warn('\n  [config-file]: Unable to find config file. config.load failed.\n', e);
    return;
  }
};


/**
 * Searches for a config file in the
 * specified npm module.
 *
 * @param   {String} name       Name of npm module to search
 * @param   {[type]} configFile package.json is the default
 * @param   {[type]} options    Parse options. See config.load
 *
 * @returns {object} config object
 * @api Public
 */

config.npmLoad = function(name, configFile, options) {
  if (typeof configFile === 'object') {
    options = configFile;
    configFile = null;
  }
  var opts = _.extend({parse: 'json'}, options);
  var npm = defNpm;
  if (typeof opts.cwd !== 'undefined') {
    npm = path.resolve.bind(path, opts.cwd, 'node_modules');
  }

  configFile = configFile || 'package.json';
  var config = file.findFile(npm(name), configFile);

  if (!config) {
    return null;
  }
  try {
    return file.readDataSync(config, opts);
  } catch (e) {
    // console.warn('\n  [config-file]: Unable to find config file. config.npmLoad failed.\n', e);
    return;
  }
};
