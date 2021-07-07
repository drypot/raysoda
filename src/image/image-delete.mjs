import * as assert2 from "../base/assert2.mjs";
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as expu from '../express/express-upload.mjs';
import * as usera from '../user/user-auth.mjs';
import * as imageb from '../image/image-base.mjs';

expb.core.delete('/api/images/:id([0-9]+)', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    const id = parseInt(req.params.id) || 0;
    imageb.checkUpdatable(user, id, function (err) {
      if (err) return done(err);
      db.query('delete from image where id = ?', id, (err) => {
        if (err) return done(err);
        imageb.fman.deleteImage(id, function (err) {
          if (err) return done(err);
          res.json({});
        });
      });
    });
  });
});
