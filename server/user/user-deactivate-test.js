'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expl = require('../express/express-local');
var userb = require('../user/user-base');
var usera = require('../user/user-auth');
var userf = require('../user/user-fixture');
var userd = require('../user/user-deactivate');
var assert = require('assert');
var assert2 = require('../base/assert2');

init.add(function (done) {
  expb.core.get('/api/test/user', function (req, res, done) {
    usera.checkUser(res, function (err, user) {
      if (err) return done(err);
      res.json({});
    });
  });
  done();
});

before(function (done) {
  init.run(done);
});

describe('deactivating self', function () {
  it('given user1 login', function (done) {
    userf.login('user1', done);
  });
  it('checkUser should succeed', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    })
  });
  it('should succeed', function (done) {
    expl.del('/api/users/' + userf.user1._id).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', function (done) {
    userb.users.findOne({ _id: userf.user1._id }, function (err, user) {
      assert.ifError(err);
      assert2.e(user.status == 'd', true);
      done();
    });
  });
  it('checkUser should fail (because logged off)', function (done) {
    expl.get('/api/test/user').end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('deactivating with no login', function () {
  it('given no login', function (done) {
    userf.logout(done);
  });
  it('should fail', function (done) {
    expl.del('/api/users/' + userf.user2._id).end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NOT_AUTHENTICATED'));
      done();
    });
  });
});

describe('deactivating other', function () {
  it('given user2 login', function (done) {
    userf.login('user2', done);
  });
  it('deactivating other should fail', function (done) {
    expl.del('/api/users/' + userf.user3._id).end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
});

describe('deactivating other by admin', function () {
  it('given admin login', function (done) {
    userf.login('admin', done);
  });
  it('should succeed', function (done) {
    expl.del('/api/users/' + userf.user3._id).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
});

