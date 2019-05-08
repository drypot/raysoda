'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var expb = require('../express/express-base');
var userb = require('../user/user-base');

expb.core.get('/users', function (req, res, done) {
  userb.users.count(function (err, count) {
    if (err) return done(err);
    res.render('userx/userx-list', { count: count });
  });
});

expb.core.get('/api/users', function (req, res, done) {
  var users = [];
  var q = (req.query.q + '').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
  userb.users.find({ namel: new RegExp('^' + q) }).limit(45).forEach(
    function (u) {
      users.push({ _id: u._id, name: u.name, home: u.home });
    },
    function (err) {
      if (err) return done(err);
      res.json( { users: users });
  });
});
