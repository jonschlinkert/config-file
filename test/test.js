const expect = require('chai').expect;
const path = require('path');
const file = require('fs-utils');
const config = require('../');

describe('local config:', function () {
  it('should parse and load package.json when no file is specified.', function () {
    var actual = config.load();
    expect(actual.name).to.eql('config-file');
  });

  it('should parse and load the specified config file and return JSON.', function () {
    var actual = config.load('test/fixtures/.configrc');
    var expected = {name: 'Config', description: 'A JSON config file'};
    expect(actual).to.eql(expected);
  });

  it('should parse the specified YAML config file and return JSON.', function () {
    var actual = config.load('test/fixtures/.configrc.yml', {parse: 'yaml'});
    var expected = {name: 'Config', description: 'A YAML config file'};
    expect(actual).to.eql(expected);
  });

  it('should return null when no config file is found', function () {
    var actual = config.load('test/fixtures/.nothingrc.yml');
    expect(actual == null).to.be.ok;
  });

  it('should parse and load package.json from a specified cwd', function () {
    var cwd = path.resolve(path.join(process.cwd(), 'node_modules', 'fs-utils'));
    var actual = config.load({cwd: cwd});
    expect(actual.name).to.eql('fs-utils');
  });

  it('should parse and load the specified config file and return JSON, given a specified cwd.', function () {
    var cwd = path.resolve(path.join(process.cwd(), 'test', 'fixtures'));
    var actual = config.load('.configrc', {cwd: cwd});
    var expected = {name: 'Config', description: 'A JSON config file'};
    expect(actual).to.eql(expected);
  });

  it('should parse the specified YAML config file and return JSON, given a specified cwd.', function () {
    var cwd = path.resolve(path.join(process.cwd(), 'test', 'fixtures'));
    var actual = config.load('.configrc.yml', {parse: 'yaml', cwd: cwd});
    var expected = {name: 'Config', description: 'A YAML config file'};
    expect(actual).to.eql(expected);
  });

  it('should return null when no config file is found', function () {
    var cwd = path.resolve(path.join(process.cwd(), 'test', 'fixtures'));
    var actual = config.load('.nothingrc.yml', {cwd: cwd});
    expect(actual == null).to.be.ok;
  });

});

describe('npm config:', function () {
  describe('when a package in node_modules is defined:', function () {
    it('should parse the specified config file and return JSON.', function () {
      var actual = config.npmLoad('fs-utils', '.jshintrc');
      var expected = {
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
      };
      expect(actual).to.eql(expected);
    });

    it('should parse the specified config file and return JSON.', function () {
      var actual = config.npmLoad('fs-utils');
      expect(actual.name).to.eql('fs-utils');
    });

    it('should parse the specified config file and return JSON.', function () {
      var actual = config.npmLoad('fs-utils', 'bower.json');
      expect(actual.name).to.eql('fs-utils');
    });
  });

  describe('when a cwd is specified', function () {
    it('should parse the specified config file and return JSON.', function () {
      var cwd = path.resolve(path.join(process.cwd(), 'node_modules', 'fs-utils'));
      var actual = config.npmLoad('globule', '.jshintrc', {cwd: cwd});
      var expected = {
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
      };
      expect(actual).to.eql(expected);
    });

    it('should parse the specified config file and return JSON.', function () {
      var cwd = path.resolve(path.join(process.cwd(), 'node_modules', 'fs-utils'));
      var actual = config.npmLoad('globule', {cwd: cwd});
      expect(actual.name).to.eql('globule');
    });

    it('should parse the specified config file and return JSON.', function () {
      var cwd = path.resolve(path.join(process.cwd(), 'node_modules', 'fs-utils'));
      var actual = config.npmLoad('js-yaml', 'bower.json', {cwd: cwd});
      expect(actual.name).to.eql('js-yaml');
    });
  });
});
