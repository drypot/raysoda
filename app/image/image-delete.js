'use strict';

const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const usera = require('../user/user-auth');
const imageb = require('../image/image-base');

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
