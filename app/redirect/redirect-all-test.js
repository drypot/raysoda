'use strict';

const assert = require('assert');
const assert2 = require('../base/assert2');
const init = require('../base/init');
const config = require('../base/config');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const redirecta = require('../redirect/redirect-all');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('redirecting /Com/Photo/View.aspx', function () {
  it('should succeed', function (done) {
    expl.get('/Com/Photo/View.aspx?f=A&pg=3&p=937928').redirects(0).end(function (err, res) {
      assert(err !== null);
      assert2.redirect(res, '/images/937928');
      done();
    });
  });
});

describe('redirecting /Com/Photo/List.aspx', function () {
  it('should succeed', function (done) {
    expl.get('/Com/Photo/List.aspx?f=A&s=DD&pg=3').redirects(0).end(function (err, res) {
      assert(err !== null);
      assert2.redirect(res, '/');
      done();
    });
  });
});

describe('redirecting /Com/Photo/CList.aspx', function () {
  it('should succeed', function (done) {
    expl.get('/Com/Photo/CList.aspx?f=C').redirects(0).end(function (err, res) {
      assert(err !== null);
      assert2.redirect(res, '/');
      done();
    });
  });
});

describe('redirecting /user', function () {
  it('should succeed', function (done) {
    expl.get('/user/1').redirects(0).end(function (err, res) {
      assert(err !== null);
      assert2.redirect(res, '/users/1');
      done();
    });
  });
});