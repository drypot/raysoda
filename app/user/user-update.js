'use strict';

var init = require('../base/init');
var error = require('../base/error');
var util2 = require('../base/util2');
var expb = require('../express/express-base');
var userb = require('../user/user-base');
var usera = require('../user/user-auth');
var usern = require('../user/user-new');

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
        util2.fif(form.password.length, function (next) {
          userb.makeHash(form.password, next)
        }, function (err, hash) {
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
        });
      });
    });
  });
});
