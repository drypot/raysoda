'use strict';

const error = require('../base/error');
const async = require('../base/async');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const userb = require('../user/user-base');
const usera = require('../user/user-auth');
const usern = require('../user/user-new');

expb.core.get('/users/:id([0-9]+)/update', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    usera.checkUpdatable(user, id, function (err) {
      if (err) return done(err);
      userb.getCached(id, function (err, tuser) {
        if (err) return done(err);
        res.render('user/user-update', {
          tuser: tuser
        });
      });
    });
  });
});

expb.core.put('/api/users/:id([0-9]+)', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    var form = usern.getForm(req);
    usera.checkUpdatable(user, id, function (err) {
      if (err) return done(err);
      usern.checkForm(form, id, function (err) {
        if (err) return done(err);
        let fields = {
          name: form.name,
          home: form.home,
          email: form.email,
          profile: form.profile
        };
        async.wf(
          (done) => {
            if (form.password.length) {
              userb.makeHash(form.password, done)
            } else {
              done();
            }
          },
          (err, hash) => {
            if (hash) {
              fields.hash = hash;
            }
            my2.query('update user set ? where id = ?', [fields, id], (err, r) => {
              if (err) return done(err);
              if (!r.changedRows) {
                return done(error('USER_NOT_FOUND'));
              }
              userb.deleteCache(id);
              res.json({});
            });
          }
        );
      });
    });
  });
});
