'use strict';

var assert = require('assert');
var path = require('path');
var config = require('../');

describe('config():', function () {
  it('should parse and load package.json when no file is specified.', function () {
    var actual = config();
    assert.equal(actual.name, 'config-file');
  });

  it('should parse and load the specified config file.', function () {
    var actual = config('test/fixtures/.configrc');
    var expected = {name: 'Config', description: 'A JSON config file'};
    assert.deepEqual(actual, expected);
  });

  it('should parse the specified YAML config file.', function () {
    var actual = config('test/fixtures/.configrc.yml', {parse: 'yaml'});
    var expected = {name: 'Config', description: 'A YAML config file'};
    assert.deepEqual(actual, expected);
  });

  it('should return null when no config file is found', function () {
    var actual = config('test/fixtures/.nothingrc.yml');
    assert.deepEqual(actual === null, true);
  });

  it('should load package.json from a specified cwd', function () {
    var cwd = path.resolve('node_modules', 'read-data');
    var actual = config({cwd: cwd});
    assert.deepEqual(actual.name, 'read-data');
  });

  it('should get a JSON config file when a cwd is specified.', function () {
    var actual = config('.configrc', {cwd: 'test/fixtures'});
    var expected = {name: 'Config', description: 'A JSON config file'};
    assert.deepEqual(actual, expected);
  });

  it('should get a YAML config file when a cwd is specified.', function () {
    var actual = config('.configrc.yml', {parse: 'yaml', cwd: 'test/fixtures'});
    var expected = {name: 'Config', description: 'A YAML config file'};
    assert.deepEqual(actual, expected);
  });

  it('should return null when no config file is found', function () {
    var actual = config('.nothingrc.yml', {cwd: 'fixtures'});
    assert.equal(actual === null, true);
  });
});

describe('config.npm():', function () {
  it('should parse the specified config file.', function () {
    var actual = config.npm('read-data', 'package.json');
    assert.equal(actual.name, 'read-data');
  });

  it('should find the config file from a cwd.', function () {
    var actual = config.npm('verb-default', 'package.json', {
      cwd: path.join(config.globalDir, 'verb-cli')
    });
    assert.equal(actual.name, 'verb-default');
  });

  it('should find the config file from a base and cwd.', function () {
    var actual = config.npm('gulp-util', 'package.json', {
      cwd: path.join(config.globalDir, 'verb-cli'),
      base: 'verb-default/node_modules'
    });
    assert.equal(actual.name, 'gulp-util');
  });

  it('should find the config file from a base.', function () {
    var actual = config.npm('is-glob', 'package.json', {base: 'look-up/node_modules'});
    assert.equal(actual.name, 'is-glob');
  });

  it('should use package.json by default.', function () {
    var actual = config.npm('read-yaml', {base: 'read-data/node_modules'});
    assert.equal(actual.name, 'read-yaml');
  });
});

describe('config.global():', function () {
  it('should parse the specified config file.', function () {
    var actual = config.global('verb-cli', 'package.json');
    assert.equal(actual.name, 'verb-cli');
  });

  it('should find the config file from a cwd.', function () {
    var actual = config.global('verb-default', 'package.json', {cwd: 'verb-cli/node_modules'});
    assert.equal(actual.name, 'verb-default');
  });

  it('should use package.json by default.', function () {
    var actual = config.global('verb-default', {cwd: 'verb-cli/node_modules'});
    assert.equal(actual.name, 'verb-default');
  });
});

describe('config.resolve()', function () {
  it('should return the path for package.json when no file is specified.', function () {
    assert.deepEqual(config.resolve(), path.resolve('package.json'));
  });

  it('should return the path for the specified config file.', function () {
    var actual = config.resolve('.configrc.yml', {cwd: 'test/fixtures'});
    var expected = path.resolve('test/fixtures/.configrc.yml');
    assert.equal(actual, expected);
  });
});
