'use strict';

const init = require('../base/init');
const error = require('../base/error');
const async2 = require('../base/async2');
const url2 = require('../base/url2');
const date2 = require('../base/date2');
const mysql2 = require('../mysql/mysql2');
const expb = require('../express/express-base');
const userb = require('../user/user-base');
const imageb = require('../image/image-base');

expb.core.get('/users/:id([0-9]+)', function (req, res, done) {
  var id = parseInt(req.params.id) || 0;
  userb.getCached(id, function (err, tuser) {
    if (err) return done(err);
    profile(req, res, tuser);
  });
});

expb.core.get('/:name([^/]+)', function (req, res, done) {
  var homel = decodeURIComponent(req.params.name).toLowerCase();
  userb.getCachedByHome(homel, function (err, tuser) {
    if (err) return done(err);
    if (!tuser) return done();
    profile(req, res, tuser);
  });
});

function profile(req, res, tuser) {
  var user = res.locals.user;
  var lt = parseInt(req.query.lt);
  var gt = parseInt(req.query.gt);
  var ps = parseInt(req.query.ps) || 16;
  var query = { uid: tuser.id };
  mongo2.findPage(imageb.images, { uid: tuser._id }, {}, gt, lt, ps, filter, function (err, images, gt, lt) {
    if (err) return done(err);
    async2.waterfall(
      (done) => {
        if (images.length) {
          let cdate = images[images.length - 1].cdate;
          var now = new Date();
          var ddate = new Date(cdate.getFullYear() - 1, now.getMonth(), now.getDate() + 1);
          mongo2.findDeepDoc(imageb.images, { uid: tuser._id }, {}, ddate, done);
        } else {
          done(null, undefined, undefined);
        }
      },
      (err, dyear, dlt) => {
        res.render('userx/userx-view', {
          tuser: tuser,
          updatable: user && (user._id === tuser._id || user.admin),
          images: images,
          gt: gt ? new url2.UrlMaker(req.path).add('gt', gt).add('ps', ps, 16).done() : undefined,
          lt: lt ? new url2.UrlMaker(req.path).add('lt', lt).add('ps', ps, 16).done() : undefined,
          dyear: dyear,
          dlt: dlt ? new url2.UrlMaker(req.path).add('lt', dlt).add('ps', ps, 16).done() : undefined,
          path: req.path
        });        
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
