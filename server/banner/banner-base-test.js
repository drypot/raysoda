var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongob = require('../mongo/mongo-base')({ dropDatabase: true });
var bannerb = require('../banner/banner-base');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('banners', function () {
  it('should exist', function () {
    expect(bannerb.banners).deep.equal([]);
  });
});