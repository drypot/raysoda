var init = require('../base/init');
var config = require('../base/config');
var mongop = require('../mongo/mongo');
var banner = exports;

banner.bannersCached = [];

init.add(function (done) {
  banner.banners = mongop.db.collection('banners');

});

