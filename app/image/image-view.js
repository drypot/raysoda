'use strict';

const error = require('../base/error');
const date2 = require('../base/date2');
const my2 = require('../mysql/my2');
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
  my2.queryOne('select * from image where id = ?', id, (err, image) => {
    if (err) return done(err);
    if (!image) return done(error('IMAGE_NOT_EXIST'));
    imageb.unpackImage(image);
    userb.getCached(image.uid, function (err, user) {
      if (err) return done(err);
      image.user = {
        id: user.id,
        name: user.name,
        home: user.home
      };
      image.dir = imageb.getUrlDir(image.id);
      image.thumb = imageb.getThumbUrl(image.id);
      image.cdateStr = date2.dateTimeString(image.cdate);
      image.cdate = image.cdate.getTime();
      if (api) {
        res.json(image);
      } else {
        var cuser = res.locals.user;
        res.render('image/image-view', {
          image: image,
          updatable: cuser && (image.user.id == cuser.id || cuser.admin),
        });
      }
    });
  });
}
