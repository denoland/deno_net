// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.

var assert = require('assert');
var path   = require('path');
var fs     = require('fs');
var yaml   = require('../');

var TEST_SCHEMA = require('./support/schema').TEST_SCHEMA;


suite('Load errors', function () {
  var samplesDir = path.resolve(__dirname, 'samples-load-errors');

  fs.readdirSync(samplesDir).forEach(function (sampleName) {
    var yamlFile = path.resolve(samplesDir, sampleName);

    test(path.basename(sampleName, '.yml'), function () {
      var yamlSource = fs.readFileSync(yamlFile, { encoding: 'utf8' });

      assert.throws(function () {
        yaml.loadAll(
          yamlSource,
          function () {},
          {
            filename: yamlFile,
            schema: TEST_SCHEMA,
            onWarning: function (e) { throw e; }
          }
        );
      }, yaml.YAMLException, yamlFile);
    });
  });
});
