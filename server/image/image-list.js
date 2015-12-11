var init = require('../base/init');
var util2 = require('../base/util2');
var error = require('../base/error');
var config = require('../base/config');
var mongo2 = require('../base/mongo2');
var expb = require('../express/express-base');
var userb = require('../user/user-base');
var imageb = require('../image/image-base');
var bannerb = require('../banner/banner-base');
var imagel = exports;

expb.core.get('/', function (req, res, done) {
  list(req, res, false, done);
});

expb.core.get('/api/images', function (req, res, done) {
  list(req, res, true, done);
});

function list(req, res, api, done) {
  var lt = parseInt(req.query.lt) || 0;
  var gt = lt ? 0 : parseInt(req.query.gt) || 0;
  var ps = parseInt(req.query.ps) || 16;
  mongo2.findPage(imageb.images, {}, {}, gt, lt, ps, filter, function (err, images, gt, lt) {
    if (err) return done(err);
    getDeep(images, function (err, dyear, dlt) {
      if (err) return done(err);
      if (api) {
        res.json({
          images: images,
          gt: gt,
          lt: lt,
          dyear, dyear,
          dlt: dlt
        });
      } else {
        res.render('image/image-list', {
          images: images,
          gt: gt ? new util2.UrlMaker('/').add('gt', gt).add('ps', ps, 16).done() : undefined,
          lt: lt ? new util2.UrlMaker('/').add('lt', lt).add('ps', ps, 16).done() : undefined,
          dyear: dyear,
          dlt: dlt ? new util2.UrlMaker('/').add('lt', dlt).add('ps', ps, 16).done() : undefined,
          banners: bannerb.banners
        });
      }
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

var dltMap = new Map();

function getDeep(images, done) {
  if (!images.length) {
    return done(null, undefined, undefined);
  }
  var now = new Date();
  var dyear = images[0].cdate.getFullYear() - 1;
  var ddate = new Date(dyear, now.getMonth(), now.getDate());
  var dndate = new Date(dyear, now.getMonth(), now.getDate() + 1);
  var ddateStr = util2.dateStringNoDash(ddate);
  var dlt = dltMap.get(ddateStr);
  if (dlt) {
    done(null, dyear, dlt);
  } else {
    var opt = { 
      sort: { cdate: 1 }, 
      limit: 1
    };
    imageb.images.findOne({ cdate: { $gte : dndate }}, opt, function (err, doc) {
      if (err) return done(err);
      if (doc && doc.cdate.getFullYear() == dyear) {
        dlt = doc._id;
        dltMap.set(ddateStr, dlt);
      }
      done(null, dyear, dlt);
    });
  }
}
