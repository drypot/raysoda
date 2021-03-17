import * as assert2 from "../base/assert2.js";
import * as error from "../base/error.js";
import * as date2 from "../base/date2.js";
import * as db from '../db/db.js';
import * as expb from '../express/express-base.js';
import * as expu from '../express/express-upload.js';
import * as userb from '../user/user-base.js';
import * as imageb from '../image/image-base.js';

expb.core.get('/api/images/:id([0-9]+)', function (req, res, done) {
  view(req, res, true, done);
});

expb.core.get('/images/:id([0-9]+)', function (req, res, done) {
  view(req, res, false, done);
});

function view(req, res, api, done) {
  const id = parseInt(req.params.id) || 0;
  db.queryOne('select * from image where id = ?', id, (err, image) => {
    if (err) return done(err);
    if (!image) return done(error.newError('IMAGE_NOT_EXIST'));
    imageb.unpackImage(image);
    userb.getCached(image.uid, function (err, user) {
      if (err) return done(err);
      image.user = {
        id: user.id,
        name: user.name,
        home: user.home
      };
      image.dir = imageb.fman.getUrlDir(image.id);
      image.thumb = imageb.fman.getThumbUrl(image.id);
      image.cdateStr = date2.dateTimeString(image.cdate);
      image.cdate = image.cdate.getTime();
      if (api) {
        res.json(image);
      } else {
        const cuser = res.locals.user;
        res.render('image/image-view', {
          image: image,
          updatable: cuser && (image.user.id === cuser.id || cuser.admin),
        });
      }
    });
  });
}
