'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userb = require('../user/user-base');
const userv = require('../user/user-view');
const userf = require('../user/user-fixture');
const usern = require('../user/user-new');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('finding user', function () {
  var _user = { name: 'test', email: 'test@def.com', password: '1234'  };
  it('given new user', function (done) {
    expl.post('/api/users').send(_user).end(function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
      _user._id = res.body.id;
      done();
    });
  });
  it('given login', function (done) {
    var form = { email: _user.email, password: _user.password };
    expl.post('/api/users/login').send(form).end(function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
      done();
    });
  });
  it('should succeed with email field', function (done) {
    expl.get('/api/users/' + _user._id).end(function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
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
      assert2.empty(res.body.err);
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
      assert2.empty(res.body.err);
      assert2.e(res.body.user._id, _user._id);
      assert2.e(res.body.user.name, _user.name);
      assert2.e(res.body.user.email, _user.email);
      done();
    });
  });
  it('given no login', function (done) {
    userf.logout(function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
      done();
    })
  });
  it('should succeed without email', function (done) {
    expl.get('/api/users/' + _user._id).end(function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
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

