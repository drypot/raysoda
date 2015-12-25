'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expl = require('../express/express-local');
var userb = require('../user/user-base');
var userv = require('../user/user-view');
var userf = require('../user/user-fixture');
var usern = require('../user/user-new');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
});

describe('finding user', function () {
  var _user = { name: 'test', email: 'test@def.com', password: '1234'  };
  it('given new user', function (done) {
    expl.post('/api/users').send(_user).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      _user._id = res.body.id;
      done();
    });
  });
  it('given login', function (done) {
    var form = { email: _user.email, password: _user.password };
    expl.post('/api/users/login').send(form).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('should succeed with email field', function (done) {
    expl.get('/api/users/' + _user._id).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert2.e(res.body.user._id, _user._id);
      assert2.e(res.body.user.name, _user.name);
      assert2.e(res.body.user.email, _user.email);
      done();
    });
  });
  it('given other\'s login', function (done) {
    userf.login('user2', done);
  });
  it('should succeed without email', function (done) {
    expl.get('/api/users/' + _user._id).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert2.e(res.body.user._id, _user._id);
      assert2.e(res.body.user.name, _user.name);
      assert2.e(res.body.user.email, undefined);
      done();
    });
  });
  it('given admin login', function (done) {
    userf.login('admin', done);
  });
  it('should succeed with email', function (done) {
    expl.get('/api/users/' + _user._id).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert2.e(res.body.user._id, _user._id);
      assert2.e(res.body.user.name, _user.name);
      assert2.e(res.body.user.email, _user.email);
      done();
    });
  });
  it('given no login', function (done) {
    userf.logout(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    })
  });
  it('should succeed without email', function (done) {
    expl.get('/api/users/' + _user._id).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert2.e(res.body.user._id, _user._id);
      assert2.e(res.body.user.name, _user.name);
      assert2.e(res.body.user.profile, '');
      assert2.e(res.body.user.email, undefined);
      done();
    });
  });
  it('should fail with invalid id', function (done) {
    expl.get('/api/users/999').end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'USER_NOT_FOUND'));
      done();
    });
  });
});

