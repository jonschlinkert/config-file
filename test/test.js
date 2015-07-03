'use strict';

var assert = require('assert');
var path = require('path');
var config = require('../');

describe('local config:', function () {
  it('should parse and load package.json when no file is specified.', function () {
    var actual = config.load();
    assert.deepEqual(actual.name, 'config-file');
  });

  it('should parse and load the specified config file and return JSON.', function () {
    var actual = config.load('test/fixtures/.configrc');
    var expected = {name: 'Config', description: 'A JSON config file'};
    assert.deepEqual(actual, expected);
  });

  it('should parse the specified YAML config file and return JSON.', function () {
    var actual = config.load('test/fixtures/.configrc.yml', {parse: 'yaml'});
    var expected = {name: 'Config', description: 'A YAML config file'};
    assert.deepEqual(actual, expected);
  });

  it('should return null when no config file is found', function () {
    var actual = config.load('test/fixtures/.nothingrc.yml');
    assert.deepEqual(actual === null, true);
  });

  it('should parse and load package.json from a specified cwd', function () {
    var cwd = path.resolve(path.join(process.cwd(), 'node_modules', 'fs-utils'));
    var actual = config.load({cwd: cwd});
    assert.deepEqual(actual.name, 'fs-utils');
  });

  it('should parse and load the specified config file and return JSON, given a specified cwd.', function () {
    var cwd = path.resolve(path.join(process.cwd(), 'test', 'fixtures'));
    var actual = config.load('.configrc', {cwd: cwd});
    var expected = {name: 'Config', description: 'A JSON config file'};
    assert.deepEqual(actual, expected);
  });

  it('should parse the specified YAML config file and return JSON, given a specified cwd.', function () {
    var cwd = path.resolve(path.join(process.cwd(), 'test', 'fixtures'));
    var actual = config.load('.configrc.yml', {parse: 'yaml', cwd: cwd});
    var expected = {name: 'Config', description: 'A YAML config file'};
    assert.deepEqual(actual, expected);
  });

  it('should return null when no config file is found', function () {
    var cwd = path.resolve(path.join(process.cwd(), 'test', 'fixtures'));
    var actual = config.load('.nothingrc.yml', {cwd: cwd});
    assert.deepEqual(actual === null, true);
  });

});

describe('npm config:', function () {
  describe('when a package in node_modules is defined:', function () {
    it('should parse the specified config file and return JSON.', function () {
      var actual = config.npmLoad('fs-utils', '.jshintrc');
      assert.deepEqual(actual, {
        "boss": true,
        "curly": true,
        "eqeqeq": true,
        "eqnull": true,
        "esnext": true,
        "immed": true,
        "latedef": true,
        "newcap": true,
        "noarg": true,
        "node": true,
        "sub": true,
        "undef": true,
        "unused": true
      });
    });

    it('should parse the specified config file and return JSON.', function () {
      var actual = config.npmLoad('fs-utils');
      assert.deepEqual(actual.name, 'fs-utils');
    });

    it('should parse the specified config file and return JSON.', function () {
      var actual = config.npmLoad('fs-utils', 'bower.json');
      assert.deepEqual(actual.name, 'fs-utils');
    });
  });

  describe('when a cwd is specified', function () {
    it('should parse the specified config file and return JSON.', function () {
      var cwd = path.resolve(path.join(process.cwd(), 'node_modules', 'fs-utils'));
      var actual = config.npmLoad('globule', '.jshintrc', {cwd: cwd});
      assert.deepEqual(actual, {
        "curly": true,
        "eqeqeq": true,
        "immed": true,
        "latedef": true,
        "newcap": true,
        "noarg": true,
        "sub": true,
        "undef": true,
        "unused": true,
        "boss": true,
        "eqnull": true,
        "node": true
      });
    });

    it('should parse the specified config file and return JSON.', function () {
      var cwd = path.resolve(path.join(process.cwd(), 'node_modules', 'fs-utils'));
      var actual = config.npmLoad('globule', {cwd: cwd});
      assert.deepEqual(actual.name, 'globule');
    });

    it('should parse the specified config file and return JSON.', function () {
      var cwd = path.resolve(path.join(process.cwd(), 'node_modules', 'fs-utils'));
      var actual = config.npmLoad('js-yaml', 'bower.json', {cwd: cwd});
      assert.deepEqual(actual.name, 'js-yaml');
    });
  });
});
