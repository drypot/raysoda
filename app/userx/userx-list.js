'use strict';

const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const usera = require('../user/user-auth');

expb.core.get('/users', function (req, res, done) {
  my2.queryOne('select count(*) as c from user', (err, r) => {
    if (err) return done(err);
    res.render('userx/userx-list', { count: r.c });
  });
});

expb.core.get('/api/users', function (req, res, done) {
  var q = req.query.q || '';
  usera.checkUser(res, function (err, user) {
    let query;
    let param;
    if (user && user.admin) {
      query = 'select id, name, home from user where name = ? or home = ? or email = ? limit 45';
      param =[q, q, q];
    } else {
      query = 'select id, name, home from user where name = ? or home = ? limit 45';
      param =[q, q];
    }
    my2.query(query, param, (err, users) => {
      if (err) return done(err);
      res.json( { users: users });
    });
  });
});
