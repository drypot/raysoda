import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expu from "../express/express-upload.mjs";
import * as usera from "../user/user-auth.mjs";
import * as imageb from "../image/image-base.mjs";

expb.router.get('/images/new', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    const now = new Date();
    getTicketCount(now, user, function (err, count, hours) {
      res.render('image/image-new', {
        ticketMax: config.prop.ticketMax,
        ticketCount: count,
        hours: hours
      });
    });
  });
});

expb.router.post('/api/images', expu.handler(function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    const form = getForm(req);
    if (!form.files) {
      return done(error.newError('IMAGE_NO_FILE'));
    }
    saveImages(user, form, (err, ids) => {
      if (err) return done(err);
      db.query('update user set pdate = ? where id = ?', [form.now, user.id], (err) => {
        if (err) return done(err);
        res.json({ ids: ids });
        done();
      });
    });
  });
}));

function saveImages(user, form, done) {
  let i = 0;
  const ids = [];
  (function create() {
    if (i === form.files.length) {
      return done(null, ids);
    }
    const upload = form.files[i++];
    getTicketCount(form.now, user, function (err, count, hours) {
      if (err) return done(err);
      if (!count) return done(null, ids);
      imageb.fman.checkImageMeta(upload.path, function (err, meta) {
        if (err) return done(err);
        const id = imageb.getNewId();
        imageb.fman.saveImage(id, upload.path, meta, function (err, vers) {
          if (err) return done(err);
          const image = {
            id: id,
            uid: user.id,
            cdate: form.now,
            vers: vers,
            comment: form.comment,
          };
          imageb.packImage(image);
          db.query('insert into image set ?', image, (err, r) => {
            if (err) return done(err);
            ids.push(id);
            setImmediate(create);
          });
        });
      });
    });
  })();
}

export function getForm(req) {
  const body = req.body;
  const form = {};
  form.now = new Date();
  form.comment = body.comment || '';
  form.files = req.files && req.files.files;
  return form;
}

export function getTicketCount(now, user, done) {
  let count = config.prop.ticketMax;
  let hours;
  db.query('select cdate from image where uid = ? order by cdate desc limit ?', [user.id, config.prop.ticketMax], (err, images) => {
    if (err) return done(err);
    for (let i = 0; i < images.length; i++) {
      hours = config.prop.ticketGenInterval - Math.floor((now.getTime() - images[i].cdate.getTime()) / (60 * 60 * 1000));
      if (hours > 0) {
        count--;
      } else {
        break;
      }
    }
    done(null, count, hours);
  });
}
