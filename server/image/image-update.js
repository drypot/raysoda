var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var fs2 = require('../base/fs2');
var util2 = require('../base/util2');
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var usera = require('../user/user-auth');
var imageb = require('../image/image-base');
var imagen = require('../image/image-new');
var imageu = exports;

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
      util2.fif(!form.files, function (next) {
        next({}, null, null);
      }, function (next) {
        var upload = form.files[0];
        imageb.checkImageMeta(upload.path, function (err, meta) {
          if (err) return done(err);
          // 파일, 디렉토리 삭제는 하지 않고 그냥 덮어쓴다.
          // 삭제할 때 파일 없을 경우 에러나는 등 부작용 가능성.
          imageb.saveImage(id, upload, meta, function (err, vers) {
            if (err) return done(err);
            next({}, meta, vers);
          });
        });
      }, function (image, meta, vers) {
        imageb.fillImageDoc(image, form, meta, vers);
        imageb.images.updateOne({ _id: id }, { $set: image }, function (err) {
          if (err) return done(err);
          res.json({});
          done();
        });
      });
    });
  });
}));
