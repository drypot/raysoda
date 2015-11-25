var init = require('../base/init');
var config = require('../base/config');
var mongob = require('../base/mongo-base');
var bannerb = exports;

bannerb.banners = [];

init.add(function (done) {
  mongob.values.find('banners', function (err, value) {
    if (err) return done(err);
    bannerb.banners = value || [];
    done();
  });
});