'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const date2 = require('../base/date2');
const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const userb = require('../user/user-base');
const imageb = require('../image/image-base');

expb.core.get('/api/images/:id([0-9]+)', function (req, res, done) {
  view(req, res, true, done);
});

expb.core.get('/images/:id([0-9]+)', function (req, res, done) {
  view(req, res, false, done);
});

function view(req, res, api, done) {
  var id = parseInt(req.params.id) || 0;
  imageb.images.findOne({ _id: id }, function (err, image) {
    if (err) return done(err);
    if (!image) return done(error('IMAGE_NOT_EXIST'));
    userb.getCached(image.uid, function (err, user) {
      if (err) return done(err);
      image.user = {
        _id: user._id,
        name: user.name,
        home: user.home
      };
      image.dir = imageb.getDirUrl(image._id);
      image.thumb = imageb.getThumbUrl(image._id);
      image.cdateStr = date2.dateTimeString(image.cdate);
      image.cdate = image.cdate.getTime();
      if (api) {
        res.json(image);
      } else {
        var cuser = res.locals.user;
        res.render('image/image-view', {
          image: image,
          updatable: cuser && (image.user._id == cuser._id || cuser.admin),
        });
      }
    });
  });
}