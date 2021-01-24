'use strict';

const assert = require('assert');
const init = require('../base/init');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const bannerb = require('../banner/banner-base');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

describe('banners', function () {
  it('should exist', function () {
    assert.deepStrictEqual(bannerb.banners, []);
  });
});