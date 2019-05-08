'use strict';

var fs = require('fs');

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var fs2 = require('../base/fs2');
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var usera = require('../user/user-auth');
var imageb = require('../image/image-base');

expb.core.delete('/api/images/:id([0-9]+)', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    imageb.checkUpdatable(user, id, function (err) {
      if (err) return done(err);
      imageb.images.deleteOne({ _id: id }, function (err, cnt) {
        if (err) return done(err);
        imageb.deleteImage(id, function (err) {
          if (err) return done(err);
          res.json({});
        });
      });
    });
  });
});
