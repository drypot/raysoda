var init = require('../base/init');
var config = require('../base/config');
var mongob = require('../mongo/mongo-base');
var bannerb = exports;

bannerb.banners = [];

init.add(function (done) {
  mongob.findValue('banners', function (err, value) {
    if (err) return done(err);
    bannerb.banners = value || [];
    done();
  });
});