'use strict';

var init = require('../base/init');
var util2 = require('../base/util2');
var error = require('../base/error');
var config = require('../base/config');
var mongo2 = require('../mongo/mongo2');
var expb = require('../express/express-base');
var userb = require('../user/user-base');
var imageb = require('../image/image-base');
var bannerb = require('../banner/banner-base');
var imagel = exports;

expb.core.get('/', function (req, res, done) {
  list(req, res, false, done);
});

expb.core.get('/api/images', function (req, res, done) {
  list(req, res, true, done);
});

function list(req, res, api, done) {
  var lt = parseInt(req.query.lt);
  var gt = parseInt(req.query.gt);
  var ps = parseInt(req.query.ps) || 16;
  mongo2.findPage(imageb.images, {}, {}, gt, lt, ps, filter, function (err, images, gt, lt) {
    if (err) return done(err);
    util2.fif(images.length, function (next) {
      let cdate = images[images.length - 1].cdate;
      var now = new Date();
      var ddate = new Date(cdate.getFullYear() - 1, now.getMonth(), now.getDate() + 1);
      mongo2.findDeepDoc(imageb.images, {}, {}, ddate, next);
    }, function (next) {
      next(null, undefined, undefined);
    }, function (err, dyear, dlt) {
      if (err) return done(err);
      if (api) {
        res.json({
          images: images,
          gt: gt,
          lt: lt,
          dyear: dyear,
          dlt: dlt
        });
      } else {
        res.render('image/image-list', {
          images: images,
          gt: gt ? new util2.UrlMaker('/').add('gt', gt).add('ps', ps, 16).done() : undefined,
          lt: lt ? new util2.UrlMaker('/').add('lt', lt).add('ps', ps, 16).done() : undefined,
          dyear: dyear,
          dlt: dlt ? new util2.UrlMaker('/').add('lt', dlt).add('ps', ps, 16).done() : undefined,
          banners: bannerb.banners
        });
      }
    });
  });
}

function filter(image, done) {
  userb.getCached(image.uid, function (err, user) {
    if (err) return done(err);
    image.user = {
      _id: user._id,
      name: user.name,
      home: user.home
    };
    image.thumb = imageb.getThumbUrl(image._id);
    image.cdateStr = util2.dateTimeString(image.cdate);
    done(null, image);
  });
}
