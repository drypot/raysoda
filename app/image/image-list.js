'use strict';

const async = require('../base/async');
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

expb.core.get('/images', function (req, res, done) {
  list(req, res, false, done);
});

expb.core.get('/api/images', function (req, res, done) {
  list(req, res, true, done);
});

function list(req, res, api, done) {
  var p = Math.max(parseInt(req.query.p) || 1, 1);
  var ps = Math.min(Math.max(parseInt(req.query.ps) || 16, 1), 128);
  my2.query('select * from image order by id desc limit ?, ?', [(p-1)*ps, ps], (err, images) => {
    if (err) return done(err);
    imagel.decoImageList(images, (err) => {
      if (err) return done(err);
      if (api) {
        res.json({
          images: images
        });
      } else {
        res.render('image/image-list', {
          images: images,
          prev: p > 1 ? new url2.UrlMaker('/images').add('p', p - 1, 1).add('ps', ps, 16).done() : undefined,
          next: new url2.UrlMaker('/images').add('p', p + 1).add('ps', ps, 16).done(),
          banners: bannerb.banners,
        });
      }
    });
  });
}

imagel.decoImageList = function (images, done) {
  let i = 0;
  (function loop() {
    if (i === images.length) {
      return done(null);
    }
    let image = images[i++];
    imageb.unpackImage(image);
    userb.getCached(image.uid, function (err, user) {
      if (err) return done(err);
      image.user = {
        id: user.id,
        name: user.name,
        home: user.home
      };
      image.thumb = imageb.getThumbUrl(image.id);
      image.cdateStr = date2.dateTimeString(image.cdate);
      setImmediate(loop);
    });
  })();
}
