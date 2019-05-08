'use strict';

const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongo/mongo2');
var bannerb = exports;

bannerb.banners = [];

init.add(function (done) {
  mongo2.values.find('banners', function (err, value) {
    if (err) return done(err);
    bannerb.banners = value || [];
    done();
  });
});