var init = require('../base/init');
var error = require('../base/error');
var util2 = require('../base/util2');
var mongo2 = require('../base/mongo2');
var expb = require('../express/express-base');
var userb = require('../user/user-base');
var imageb = require('../image/image-base');

expb.core.get('/users/:id([0-9]+)', function (req, res, done) {
  var id = parseInt(req.params.id) || 0;
  userb.getCached(id, function (err, tuser) {
    if (err) return done(err);
    profile(req, res, tuser);
  });
});

expb.core.get('/:name([^/]+)', function (req, res, done) {
  var homel = decodeURIComponent(req.params.name).toLowerCase();
  userb.getCachedByHome(homel, function (err, tuser) {
    if (err) return done(err);
    if (!tuser) return done();
    profile(req, res, tuser);
  });
});

function profile(req, res, tuser) {
  var user = res.locals.user;
  var lt = parseInt(req.query.lt);
  var gt = parseInt(req.query.gt);
  var ps = parseInt(req.query.ps) || 16;
  var query = { uid: tuser.id };
  mongo2.findPage(imageb.images, { uid: tuser._id }, {}, gt, lt, ps, filter, function (err, images, gt, lt) {
    if (err) return done(err);
    res.render('image/image-listu', {
      tuser: tuser,
      updatable: user && (user._id === tuser._id || user.admin),
      images: images,
      gt: gt ? new util2.UrlMaker(req.path).add('gt', gt).add('ps', ps, 16).done() : undefined,
      lt: lt ? new util2.UrlMaker(req.path).add('lt', lt).add('ps', ps, 16).done() : undefined
    });
  });
}

function filter(image, done) {
  userb.getCached(image.uid, function (err, user) {
    if (err) return done(err);
    image.user = {
      _id: user._id,
      name: user.name,
      home: user.home
    };
    image.thumb = imageb.getThumbUrl(image._id);
    image.cdateStr = util2.dateTimeString(image.cdate);
    done(null, image);
  });
}
