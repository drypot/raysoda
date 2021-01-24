'use strict';

const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const usera = require('../user/user-auth');
const imageb = require('../image/image-base');
const imagen = exports;

expb.core.get('/images/new', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    var now = new Date();
    getTicketCount(now, user, function (err, count, hours) {
      res.render('image/image-new', {
        ticketMax: config.ticketMax,
        ticketCount: count,
        hours: hours
      });
    });
  });
});

expb.core.post('/api/images', expu.handler(function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    var form = getForm(req);
    if (!form.files) {
      return done(error('IMAGE_NO_FILE'));
    }
    saveImages(user, form, (err, ids) => {
      if (err) return done(err);
      my2.query('update user set pdate = ? where id = ?', [form.now, user.id], (err) => {
        if (err) return done(err);
        res.json({ ids: ids });
        done();
      });
    });
  });
}));

function saveImages(user, form, done) {
  var i = 0;
  var ids = [];
  (function create() {
    if (i === form.files.length) {
      return done(null, ids);
    }
    var upload = form.files[i++];
    getTicketCount(form.now, user, function (err, count, hours) {
      if (err) return done(err);
      if (!count) return done(null, ids);
      imageb.checkImageMeta(upload.path, function (err, meta) {
        if (err) return done(err);
        var id = imageb.getNewId();
        imageb.saveImage(id, upload.path, meta, function (err, vers) {
          if (err) return done(err);
          var image = {
            id: id,
            uid: user.id,
            cdate: form.now,
            vers: vers,
            comment: form.comment,
          };
          imageb.packImage(image);
          my2.query('insert into image set ?', image, (err, r) => {
            if (err) return done(err);
            ids.push(id);
            setImmediate(create);
          });
        });
      });
    });
  })();
}

var getForm = imagen.getForm = function (req) {
  var body = req.body;
  var form = {};
  form.now = new Date();
  form.comment = body.comment || '';
  form.files = req.files && req.files.files;
  return form;
}

var getTicketCount = imagen.getTicketCount = function(now, user, done) {
  var count = config.ticketMax;
  var hours;
  my2.query('select cdate from image where uid = ? order by cdate desc limit ?', [user.id, config.ticketMax], (err, images) => {
    if (err) return done(err);
    for (var i = 0; i < images.length; i++) {
      hours = config.ticketGenInterval - Math.floor((now.getTime() - images[i].cdate.getTime()) / (60 * 60 * 1000));
      if (hours > 0) {
        count--;
      } else {
        break;
      }
    }
    done(null, count, hours);
  });
};