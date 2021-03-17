import * as assert2 from "../base/assert2.js";
import * as expb from "../express/express-base.js";
import * as dbPersist from "../db/db-persist.js";
import * as usera from "../user/user-auth.js";
import * as bannerb from "../banner/banner-base.js";

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
    bannerb.setBanners(req.body.banners);
    dbPersist.update('banners', bannerb.banners, function (err) {
      if (err) return done(err);
      res.json({});
    });
  });
});
