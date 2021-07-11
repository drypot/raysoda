import * as expb from "../express/express-base.mjs";
import * as dbPersist from "../db/db-persist.mjs";
import * as usera from "../user/user-auth.mjs";
import * as bannerb from "../banner/banner-base.mjs";

expb.router.get('/supp/banners', function (req, res, done) {
  usera.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    res.render('banner/banner-update', {
      banners: bannerb.banners
    });
  });
});

expb.router.get('/api/banners', function (req, res, done) {
  usera.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    res.json({
      banners: bannerb.banners
    });
  });
});

expb.router.put('/api/banners', function (req, res, done) {
  usera.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    bannerb.setBanners(req.body.banners);
    dbPersist.update('banners', bannerb.banners, function (err) {
      if (err) return done(err);
      res.json({});
    });
  });
});
