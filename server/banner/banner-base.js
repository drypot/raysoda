var init = require('../base/init');
var config = require('../base/config');
var mongob = require('../mongo/mongo-base');
var userb = require('../user/user-base');
var expb = require('../express/express-base');
var bannerb = exports;

bannerb.banners = [];

init.add(function (done) {
  mongob.findValue('banners', function (err, value) {
    if (err) return done(err);
    bannerb.banners = value || [];
    done();
  });
});

expb.core.get('/extra/banners', function (req, res, done) {
  userb.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    res.render('banner/banner-update', {
      banners: bannerb.banners
    });
  });
});

expb.core.get('/api/banners', function (req, res, done) {
  userb.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    res.json({
      banners: bannerb.banners
    });
  });
});

expb.core.put('/api/banners', function (req, res, done) {
  userb.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    bannerb.banners = req.body.banners || [];
    mongob.updateValue('banners', bannerb.banners, function (err) {
      if (err) return done(err);
      res.json({});
    });
  });
});
