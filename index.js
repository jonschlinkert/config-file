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
const local  = path.resolve.bind(path, cwd, '');
const npm    = path.resolve.bind(path, cwd, 'node_modules');


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

config.find = function(filepath) {
  var filename = path.basename(filepath);
  var homeConfig = file.findFile(home(filename));
  var localConfig = file.findFile(local(filepath));
  try {
    return localConfig;
  } catch(err) {
    if (file.exists(homeConfig)) {
      return homeConfig;
    }
    return null;
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
  var opts = _.extend({parse: 'json'}, options);
  var configFile = config.find(filename, opts);
  return file.readDataSync(configFile, opts);
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
  var opts = _.extend({parse: 'json'}, options);
  configFile = configFile || 'package.json';
  var config = file.findFile(npm(name), configFile);

  if (!config) {
    return null;
  }
  try {
    return file.readDataSync(config, opts);
  } catch (e) {
    return null;
  }
};
