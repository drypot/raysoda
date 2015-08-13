var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var fsp = require('../base/fs');
var utilp = require('../base/util');
var exp = require('../express/express');
var upload = require('../express/upload');
var userb = require('../user/user-base');
var imageb = require('../image/image-base');
var imagen = require('../image/image-new');
var site = require('../image/image-site');
var imageu = exports;

exp.core.get('/images/:id([0-9]+)/update', function (req, res, done) {
  userb.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    imageu.checkUpdatable(id, user, function (err, image) {
      if (err) return done(err);
      res.render('image/image-update', {
        image: image
      });
    });
  });
});

exp.core.put('/api/images/:id([0-9]+)', upload.handler(function (req, res, done) {
  userb.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    var form = imagen.getForm(req);
    imageu.checkUpdatable(id, user, function (err) {
      if (err) return done(err);
      utilp.fif(!form.files, function (next) {
        next({}, null, null);
      }, function (next) {
        var upload1 = form.files[0];
        site.checkImageMeta(upload1, function (err, meta) {
          if (err) return done(err);
          var save = new imageb.FilePath(id);
          fsp.removeDir(save.dir, function (err) {
            if (err) return done(err);
            fsp.makeDir(save.dir, function (err) {
              if (err) return done(err);
              site.makeVersions(upload1, save, meta, function (err, vers) {
                if (err) return done(err);
                next({}, meta, vers);
              });
            });
          });
        });
      }, function (image, meta, vers) {
        site.fillFields(image, form, meta, vers);
        imageb.images.updateOne({ _id: id }, { $set: image }, function (err) {
          if (err) return done(err);
          res.json({});
          done();
        });
      });
    });
  });
}));

imageu.checkUpdatable = function (id, user, done) {
  imageb.images.findOne({ _id: id }, function (err, image) {
    if (err) return done(err);
    if (!image) {
      return done(error('IMAGE_NOT_EXIST'));
    }
    if (image.uid != user._id && !user.admin) {
      return done(error('NOT_AUTHORIZED'));
    }
    done(null, image);
  });
}
