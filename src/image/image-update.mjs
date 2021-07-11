import * as async2 from '../base/async.mjs';
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as expu from '../express/express-upload.mjs';
import * as usera from '../user/user-auth.mjs';
import * as imageb from '../image/image-base.mjs';
import * as imagen from '../image/image-new.mjs';

expb.router.get('/images/:id([0-9]+)/update', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    const id = parseInt(req.params.id) || 0;
    imageb.checkUpdatable(user, id, function (err, image) {
      if (err) return done(err);
      res.render('image/image-update', {
        image: image
      });
    });
  });
});

expb.router.put('/api/images/:id([0-9]+)', expu.handler(function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    const id = parseInt(req.params.id) || 0;
    const form = imagen.getForm(req);
    imageb.checkUpdatable(user, id, function (err) {
      if (err) return done(err);
      async2.waterfall(
        (done) => {
          if (form.files) {
            let upload = form.files[0];
            imageb.fman.checkImageMeta(upload.path, function (err, meta) {
              if (err) return done(err);
              // 파일, 디렉토리 삭제는 하지 않고 그냥 덮어쓴다.
              // 삭제할 때 파일 없을 경우 에러나는 등 부작용 가능성.
              imageb.fman.saveImage(id, upload.path, meta, function (err, vers) {
                if (err) return done(err);
                done(null, { vers: vers });
              });
            });
          } else {
            done(null, {});
          }
        },
        (err, image) => {
          if (err) return done(err);
          image.comment = form.comment;
          imageb.packImage(image);
          db.query('update image set ? where id = ?', [image, id], (err) => {
            if (err) return done(err);
            res.json({});
          });
        }
      );
    });
  });
}));
