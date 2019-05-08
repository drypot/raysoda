'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const mongo2 = require('../mongo/mongo2');
const bannerb = require('../banner/banner-base');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/test.json';
  mongo2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('banners', function () {
  it('should exist', function () {
    assert2.de(bannerb.banners, []);
  });
});