'use strict';

const date2 = require('../base/date2');
const expb = require('../express/express-base');
const usera = require('../user/user-auth');
const counterb = require('../counter/counter-base');

expb.core.get('/api/counters/:id/inc', function (req, res, done) {
  counterb.update(req.params.id, date2.today(), function (err) {
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
    var q = { id: req.params.id };
    if (req.query.b && req.query.e) {
      q.d = { $gte : date2.dateFromString(req.query.b), $lte: date2.dateFromString(req.query.e) };
    }
    counterb.counters.find(q, { _id: 0 }).toArray(function (err, counters) {
      if (err) return done(err);
      res.json( { counters: counters })
    });
  });
});

