'use strict';

const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const usera = require('../user/user-auth');
const counterb = require('../counter/counter-base');

expb.core.get('/api/counters/:id/inc', function (req, res, done) {
  counterb.update(req.params.id, new Date(), function (err) {
    if (err) return done(err);
    res.redirect(req.query.r);
  })
});

expb.core.get('/supp/counters', function (req, res, done) {
  usera.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    res.render('counter/counter-list');
  });
});

expb.core.get('/api/counters/:id', function (req, res, done) {
  usera.checkAdmin(res, function (err, user) {
    if (err) return done(err);
    my2.query(
      'select d, c from counter where id = ? and d between ? and ?',
      [req.params.id, req.query.b, req.query.e],
      (err, r) => {
        if (err) return done(err);
        let a = [];
        for(let i = 0; i < r.length; i ++) {
          let row = r[i];
          a.push({ 
            d: row.d, 
            c: row.c 
          });
        }
        res.json( { counters: a });      
      }
    );
  });
});
