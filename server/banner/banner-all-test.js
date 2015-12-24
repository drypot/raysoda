'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var bannera = require('../banner/banner-all');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
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
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      done();
    });
  });
  it('putting can be checked', function (done) {
    mongo2.values.find('banners', function (err, value) {
      expect(err).not.exist;
      expect(value).deep.equal(banners1);
      done();
    });
  });
  it('getting should succeed', function (done) {
    expl.get('/api/banners').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.banners).deep.equal(banners1);
      done();
    })
  });
  it('given user login', function (done) {
   userf.login('user1', done);
  });
  it('putting should fail', function (done) {
    expl.put('/api/banners').send({ banners: banners1 }).end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).error('NOT_AUTHORIZED');
      done();
    });
  });
  it('getting should fail', function (done) {
    expl.get('/api/banners').end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).error('NOT_AUTHORIZED');
      done();
    })
  });
});

