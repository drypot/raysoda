'use strict';

const init = require('../base/init');
const async2 = require('../base/async2');
const url2 = require('../base/url2');
const date2 = require('../base/date2');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const userb = require('../user/user-base');
const imageb = require('../image/image-base');
const bannerb = require('../banner/banner-base');
const imagel = exports;

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
    async2.waterfall(
      (done) => {
        if (images.length) {
          let cdate = images[images.length - 1].cdate;
          var now = new Date();
          var ddate = new Date(cdate.getFullYear() - 1, now.getMonth(), now.getDate() + 1);
          mongo2.findDeepDoc(imageb.images, {}, {}, ddate, done);
        } else {
          done(null, undefined, undefined)
        }
      },
      (err, dyear, dlt) => {
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
            gt: gt ? new url2.UrlMaker('/').add('gt', gt).add('ps', ps, 16).done() : undefined,
            lt: lt ? new url2.UrlMaker('/').add('lt', lt).add('ps', ps, 16).done() : undefined,
            dyear: dyear,
            dlt: dlt ? new url2.UrlMaker('/').add('lt', dlt).add('ps', ps, 16).done() : undefined,
            banners: bannerb.banners
          });
        }
      }
    );
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
    image.cdateStr = date2.dateTimeString(image.cdate);
    done(null, image);
  });
}
