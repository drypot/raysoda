'use strict';

const init = require('../base/init');
const error = require('../base/error');
const async = require('../base/async');
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
      form.namel = form.name.toLowerCase();
      form.homel = form.home.toLowerCase();
      usern.checkForm(form, id, function (err) {
        if (err) return done(err);
        var fields = {
          name: form.name,
          namel: form.namel,
          home: form.home,
          homel: form.homel,
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
            userb.users.updateOne({ _id: id }, { $set: fields }, function (err, r) {
              if (err) return done(err);
              if (!r.matchedCount) {
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
