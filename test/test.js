const expect = require('chai').expect;
const file = require('fs-utils');
const config = require('../');

describe('local config:', function () {
  it('should parse the specified config file and return JSON.', function () {
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
    expect(actual).to.eql(null);
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
});