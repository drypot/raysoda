'use strict';

const init = require('../base/init');
const persist = require('../mysql/persist');
const bannerb = exports;

bannerb.banners = [];

init.add(function (done) {
  persist.find('banners', function (err, value) {
    if (err) return done(err);
    bannerb.banners = value || [];
    done();
  });
});