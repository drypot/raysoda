'use strict';

const async = require('../base/async');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const usera = require('../user/user-auth');
const imageb = require('../image/image-base');
const imagen = require('../image/image-new');
const imageu = exports;

expb.core.get('/images/:id([0-9]+)/update', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    imageb.checkUpdatable(user, id, function (err, image) {
      if (err) return done(err);
      res.render('image/image-update', {
        image: image
      });
    });
  });
});

expb.core.put('/api/images/:id([0-9]+)', expu.handler(function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    var form = imagen.getForm(req);
    imageb.checkUpdatable(user, id, function (err) {
      if (err) return done(err);
      async.wf(
        (done) => {
          if (form.files) {
            let upload = form.files[0];
            imageb.checkImageMeta(upload.path, function (err, meta) {
              if (err) return done(err);
              // 파일, 디렉토리 삭제는 하지 않고 그냥 덮어쓴다.
              // 삭제할 때 파일 없을 경우 에러나는 등 부작용 가능성.
              imageb.saveImage(id, upload.path, meta, function (err, vers) {
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
          my2.query('update image set ? where id = ?', [image, id], (err) => {
            if (err) return done(err);
            res.json({});
          });
        }
      );
    });
  });
}));
