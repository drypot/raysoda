var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var util2 = require('../base/util2');
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var userb = require('../user/user-base');
var imageb = require('../image/image-base');
var site = require('../image/image-site');

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
      image.dir = imageb.getUrlBase(image._id);
      image.cdateStr = util2.toDateTimeString(image.cdate);
      image.cdate = image.cdate.getTime();
      if (api) {
        res.json(image);
      } else {
        var cuser = res.locals.user;
        res.render('image/image-view', {
          image: image,
          updatable: cuser && (image.user._id == cuser._id || cuser.admin),
          imageView: true
        });
      }
    });
  });
}