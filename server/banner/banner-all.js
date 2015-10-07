var init = require('../base/init');
var config = require('../base/config');
var mongob = require('../mongo/mongo-base');
var expb = require('../express/express-base');
var usera = require('../user/user-auth');
var bannerb = require('../banner/banner-base');

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
    mongob.values.update('banners', bannerb.banners, function (err) {
      if (err) return done(err);
      res.json({});
    });
  });
});