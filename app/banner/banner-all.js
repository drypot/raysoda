'use strict';

const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongo/mongo2');
const expb = require('../express/express-base');
const usera = require('../user/user-auth');
const bannerb = require('../banner/banner-base');

expb.core.get('/supp/banners', function (req, res, done) {
  usera.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    res.render('banner/banner-update', {
      banners: bannerb.banners
    });
  });
});

expb.core.get('/api/banners', function (req, res, done) {
  usera.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    res.json({
      banners: bannerb.banners
    });
  });
});

expb.core.put('/api/banners', function (req, res, done) {
  usera.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    bannerb.banners = req.body.banners;
    mongo2.values.update('banners', bannerb.banners, function (err) {
      if (err) return done(err);
      res.json({});
    });
  });
});