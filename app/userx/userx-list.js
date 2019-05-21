'use strict';

const my2 = require('../mysql/my2');
const expb = require('../express/express-base');

expb.core.get('/users', function (req, res, done) {
  userb.users.count(function (err, count) {
    if (err) return done(err);
    res.render('userx/userx-list', { count: count });
  });
});

expb.core.get('/api/users', function (req, res, done) {
  var users = [];
  var q = (req.query.q || '').toLowerCase();
  my2.query('select id, name, home from user where namel = ? or homel = ? limit 45', [q, q], (err, users) => {
    if (err) return done(err);
    res.json( { users: users });
  });
});
