'use strict';

const error = require('../base/error');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const userb = require('../user/user-base');
const usera = require('../user/user-auth');

expb.core.delete('/api/users/:id([0-9]+)', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    var id = parseInt(req.params.id) || 0;
    usera.checkUpdatable(user, id, function (err) {
      if (err) return done(err);
      my2.query('update user set status = "d" where id = ?', id, (err, r) => {
        if (err) return done(err);
        if (!r.changedRows) {
          return done(error('USER_NOT_FOUND'));
        }
        userb.deleteCache(id);
        if (user.id === id) {
          usera.logout(req, res);
        }
        res.json({});
      });
    });
  });
});

expb.core.get('/users/deactivate', function (req, res, done) {
  usera.checkUser(res, function (err, user) {
    if (err) return done(err);
    res.render('user/user-deactivate');
  });
});
