'use strict';

const expb = require('../express/express-base');

expb.core.get('/about/site', function (req, res, done) {
  res.render('about/about-site');
});

expb.core.get('/about/company', function (req, res, done) {
  res.render('about/about-company');
});

expb.core.get('/about/ad', function (req, res, done) {
  res.render('about/about-ad');
});

expb.core.get('/about/privacy', function (req, res, done) {
  res.render('about/about-privacy');
});

expb.core.get('/about/help', function (req, res, done) {
  res.render('about/about-help');
});
