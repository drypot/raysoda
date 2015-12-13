'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var expb = require('../express/express-base');
var expl = require('../express/express-local');
var redirecta = require('../redirect/redirect-all');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('redirecting /Com/Photo/View.aspx', function () {
  it('should succeed', function (done) {
    expl.get('/Com/Photo/View.aspx?f=A&pg=3&p=937928').redirects(0).end(function (err, res) {
      expect(err).exist;
      expect(res).redirectTo('/images/937928');
      done();
    });
  });
});

describe('redirecting /Com/Photo/List.aspx', function () {
  it('should succeed', function (done) {
    expl.get('/Com/Photo/List.aspx?f=A&s=DD&pg=3').redirects(0).end(function (err, res) {
      expect(err).exist;
      expect(res).redirectTo('/');
      done();
    });
  });
});

describe('redirecting /Com/Photo/CList.aspx', function () {
  it('should succeed', function (done) {
    expl.get('/Com/Photo/CList.aspx?f=C').redirects(0).end(function (err, res) {
      expect(err).exist;
      expect(res).redirectTo('/');
      done();
    });
  });
});

describe('redirecting /user', function () {
  it('should succeed', function (done) {
    expl.get('/user/1').redirects(0).end(function (err, res) {
      expect(err).exist;
      expect(res).redirectTo('/users/1');
      done();
    });
  });
});