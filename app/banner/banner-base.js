'use strict';

const init = require('../base/init');
const jsont = require('../mysql/jsont');
const bannerb = exports;

bannerb.banners = [];

init.add(function (done) {
  jsont.find('banners', function (err, value) {
    if (err) return done(err);
    bannerb.banners = value || [];
    done();
  });
});