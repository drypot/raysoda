import crypto from "crypto";
import {v4 as uuid} from "uuid";
import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";
import * as mailer2 from "../mailer/mailer2.js";
import * as userb from "../user/user-base.js";
import * as usern from "../user/user-new.js";

init.add(
  (done) => {
    db.query(`
      create table if not exists pwreset(
        uuid char(36) character set latin1 collate latin1_bin not null,
        email varchar(64) not null,
        token char(64) character set latin1 collate latin1_bin not null,
        primary key (uuid)
      )
    `, done);
  },
  (done) => {
    db.query(`
      create index pwreset_email on pwreset(email);
    `, () => { done(); });
  },
);

expb.core.get('/users/reset-pass', function (req, res, done) {
  res.render('user/user-reset-pass');
});

expb.core.post('/api/reset-pass', function (req, res, done) {
  const form = {};
  form.email = String(req.body.email || '').trim();
  const errors = [];
  usern.checkFormEmail(form, errors);
  if (errors.length) {
    return done(error.newError(errors));
  }
  db.queryOne('select * from user where email = ?', form.email, (err, user) => {
    if (err) return done(err);
    if (!user) {
      return done(error.newError('EMAIL_NOT_EXIST'));
    }
    db.query('delete from pwreset where email = ?', form.email, (err) => {
      if (err) return done(err);
      crypto.randomBytes(32, function(err, buf) {
        const reset = {
          uuid: uuid(),
          email: form.email,
          token: buf.toString('hex'),
        };
        db.query('insert into pwreset set ?', reset, (err) => {
          if (err) return done(err);
          const mail = {
            from: 'no-reply@raysoda.com',
            to: reset.email,
            subject: 'Reset Password - ' + config.prop.appName,
            text:
              '\n' +
              'Open the following URL to reset your password.\n\n' +
              config.prop.mainSite + '/users/reset-pass?step=3&uuid=' + reset.uuid + '&t=' + reset.token + '\n\n' +
              config.prop.appName
          };
          mailer2.send(mail, function (err) {
            if (err) return done(err);
            res.json({});
          });
        });
      })
    });
  });
});

expb.core.put('/api/reset-pass', function (req, res, done) {
  const body = req.body;
  const form = {};
  form.uuid = String(body.uuid || '').trim();
  form.token = String(body.token || '').trim();
  form.password = String(body.password || '').trim();
  const errors = [];
  usern.checkFormPassword(form, errors);
  if (errors.length) {
    return done(error.newError(errors));
  }
  db.queryOne('select * from pwreset where uuid = ?', form.uuid, (err, reset) => {
    if (err) return done(err);
    if (!reset) {
      return done(error.newError('INVALID_DATA'));
    }
    if (form.token !== reset.token) {
      return done(error.newError('INVALID_DATA'));
    }
    userb.makeHash(form.password, function (err, hash) {
      if (err) return done(err);
      db.query('update user set hash = ? where email = ?', [hash, reset.email], (err) => {
        if (err) return done(err);
        db.query('delete from pwreset where uuid = ?', form.uuid, (err) => {
          if (err) return done(err);
          res.json({});
        });
      });
    });
  });
});
