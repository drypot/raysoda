'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var expb = require('../express/express-base');

/* redirects for raysoda v1 */

expb.core.get('/Com/Photo/View.aspx', function (req, res, done) {
  res.redirect('/images/' + req.query.p);
});

expb.core.get('/Com/Photo/List.aspx', function (req, res, done) {
  if (req.query.u) {
    res.redirect('/users/' + req.query.u);
  } else {
    res.redirect('/');
  }
});

expb.core.get('/Com/Photo/CList.aspx', function (req, res, done) {
  res.redirect('/');
});

expb.core.get('/user/:id([0-9]+)', function (req, res, done) {
  res.redirect('/users/' + req.params.id);
});
