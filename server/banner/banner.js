var init = require('../base/init');
var config = require('../base/config');
var mongob = require('../mongo/mongo-base');
var banner = exports;

banner.bannersCached = [];

init.add(function (done) {
  banner.banners = mongob.db.collection('banners');

});

