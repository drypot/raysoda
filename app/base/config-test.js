'use strict';

const assert = require('assert');
const init = require('../base/init');
const config = require('../base/config');

before(() => {
  config.path = 'config/test.json';
});

describe('config with valid path', function () {
  it('should succeed', function (done) {
    init.run(function (err) {
      assert.ifError(err);
      assert(config.appName !== undefined);
      assert(config.xxx === undefined);
      done();
    });
  });
});

