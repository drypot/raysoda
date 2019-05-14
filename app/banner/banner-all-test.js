'use strict';

const assert = require('assert');
const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const jsont = require('../mysql/jsont');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userf = require('../user/user-fixture');
const bannera = require('../banner/banner-all');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('banners', function () {
   var banners1 = [
    { text: "text1", url: "http://url1" },
    { text: "text2", url: "http://url2" },
    { text: "text3", url: "http://url3" },
  ];
  it('given admin login', function (done) {
   userf.login('admin', done);
  });
  it('putting should succeed', function (done) {
    expl.put('/api/banners').send({ banners: banners1 }).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('putting can be checked', function (done) {
    jsont.find('banners', function (err, value) {
      assert.ifError(err);
      assert.deepStrictEqual(value, banners1);
      done();
    });
  });
  it('getting should succeed', function (done) {
    expl.get('/api/banners').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.deepStrictEqual(res.body.banners, banners1);
      done();
    })
  });
  it('given user login', function (done) {
   userf.login('user1', done);
  });
  it('putting should fail', function (done) {
    expl.put('/api/banners').send({ banners: banners1 }).end(function (err, res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
  it('getting should fail', function (done) {
    expl.get('/api/banners').end(function (err, res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    })
  });
});

