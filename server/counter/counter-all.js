'use strict';

var init = require('../base/init');
var config = require('../base/config');
var util2 = require('../base/util2');
var expb = require('../express/express-base');
var usera = require('../user/user-auth');
var counterb = require('../counter/counter-base');

expb.core.get('/api/counters/:id/inc', function (req, res, done) {
  counterb.update(req.params.id, util2.today(), function (err) {
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
      q.d = { $gte : util2.dateFromString(req.query.b), $lte: util2.dateFromString(req.query.e) };
    }
    counterb.counters.find(q, { _id: 0 }).toArray(function (err, counters) {
      if (err) return done(err);
      res.json( { counters: counters })
    });
  });
});

