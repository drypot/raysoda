'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var expb = require('../express/express-base');
var userb = require('../user/user-base');

expb.core.get('/users', function (req, res, done) {
  userb.users.count(function (err, count) {
    if (err) return done(err);
    res.render('user/user-list', { count: count });
  });
});

expb.core.get('/api/users', function (req, res, done) {
  var users = [];
  var q = (req.query.q + '').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
  userb.users.find({ namel: new RegExp('^' + q) }).limit(45).each(function (err, u) {
    if (err) return done(err);
    if (u) {
      users.push({ _id: u._id, name: u.name, home: u.home });
    } else {
      res.json( { users: users });
    }
  });
});