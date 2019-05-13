'use strict';

const crypto = require('crypto');
const uuid = require('uuid/v4');
const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const mailer2 = require('../mailer/mailer2');
const userb = require('../user/user-base');
const usern = require('../user/user-new');
const userp = exports;

init.add(
  (done) => {
    my2.query(`
      create table if not exists pwreset(
        uuid char(36) character set latin1 collate latin1_bin not null,
        email varchar(64) not null,
        token char(64) character set latin1 collate latin1_bin not null,
        primary key (uuid)
      )
    `, done);
  },
  (done) => {
    my2.query(`
      create index pwreset_email on pwreset(email);
    `, () => { done(); });
  },
);

expb.core.get('/users/reset-pass', function (req, res, done) {
  res.render('user/user-reset-pass');
});

expb.core.post('/api/reset-pass', function (req, res, done) {
  var form = {};
  form.email = String(req.body.email || '').trim();
  var errors = [];
  usern.checkFormEmail(form, errors);
  if (errors.length) {
    return done(error(errors));
  }
  my2.queryOne('select * from user where email = ?', form.email, (err, user) => {
    if (err) return done(err);
    if (!user) {
      return done(error('EMAIL_NOT_EXIST'));
    }
    my2.query('delete from pwreset where email = ?', form.email, (err) => {
      if (err) return done(err);
      crypto.randomBytes(32, function(err, buf) {
        var reset = {
          uuid: uuid(),
          email: form.email,
          token: buf.toString('hex'),
        };
        my2.query('insert into pwreset set ?', reset, (err) => {
          if (err) return done(err);
          var mail = {
            from: 'no-reply@raysoda.com',
            to: reset.email,
            subject: 'Reset Password - ' + config.appName,
            text:
              '\n' +
              'Open the following URL to reset your password.\n\n' +
              config.mainSite + '/users/reset-pass?step=3&uuid=' + reset.uuid + '&t=' + reset.token + '\n\n' +
              config.appName
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
  var body = req.body;
  var form = {};
  form.uuid = String(body.uuid || '').trim();
  form.token = String(body.token || '').trim();
  form.password = String(body.password || '').trim();
  var errors = [];
  usern.checkFormPassword(form, errors);
  if (errors.length) {
    return done(error(errors));
  }
  my2.queryOne('select * from pwreset where uuid = ?', form.uuid, (err, reset) => {
    if (err) return done(err);
    if (!reset) {
      return done(error('INVALID_DATA'));
    }
    if (form.token != reset.token) {
      return done(error('INVALID_DATA'));
    }
    userb.makeHash(form.password, function (err, hash) {
      if (err) return done(err);
      my2.query('update user set hash = ? where email = ?', [hash, reset.email], (err) => {
        if (err) return done(err);
        my2.query('delete from pwreset where uuid = ?', form.uuid, (err) => {
          if (err) return done(err);
          res.json({});
        });
      });
    });
  });
});
