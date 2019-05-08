'use strict';

const bcrypt = require('bcrypt');

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const mongo2 = require('../mongo/mongo2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userb = require('../user/user-base');
const userf = require('../user/user-fixture');
const userp = require('../user/user-reset-pass');
const assert = require('assert');
const assert2 = require('../base/assert2');

before(function (done) {
  config.path = 'config/test.json';
  mongo2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('resetting user', function () {
  var _user;
  var _reset;
  before(function () {
    _user = userf.user1;
  });
  it('old password should be ok', function (done) {
    userb.users.findOne({ email: _user.email }, function (err, user) {
      assert.ifError(err);
      userb.checkPassword(_user.password, user.hash, function (err, matched) {
        assert.ifError(err);
        assert2.e(matched, true);
        done();
      });
    });
  });
  it('reset request should succeed', function (done) {
    expl.post('/api/reset-pass').send({ email: _user.email }).end(function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
      done();
    });
  });
  it('can be checked', function (done) {
    userp.resets.findOne({ email: _user.email }, function (err, reset) {
      assert.ifError(err);
      assert2.ne(reset._id, undefined);
      assert2.ne(reset.token, undefined);
      assert2.e(reset.email, _user.email);
      _reset = reset;
      done();
    });
  });
  it('invalid email should fail', function (done) {
    expl.post('/api/reset-pass').send({ email: 'abc.def.xyz' }).end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'EMAIL_PATTERN'));
      done();
    });
  });
  it('unregistered email should fail', function (done) {
    expl.post('/api/reset-pass').send({ email: 'non-exist@xyz.com' }).end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'EMAIL_NOT_EXIST'));
      done();
    });
  });
  it('invalid id should fail', function (done) {
    var form = { id: '012345678901234567890123', token: _reset.token, password: '4567' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'INVALID_DATA'));
      done();
    });
  });
  it('invalid token should fail', function (done) {
    var form = { id: _reset._id, token: 'xxxxx', password: '4567' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'INVALID_DATA'));
      done();
    });
  });
  it('invalid password should fail', function (done) {
    var form = { id: _reset._id, token: _reset.token, password: '' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'PASSWORD_EMPTY'));
      done();
    });
  });
  it('invalid password should fail', function (done) {
    var form = { id: _reset._id, token: _reset.token, password: 'xx' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'PASSWORD_RANGE'));
      done();
    });
  });
  it('should succeed', function (done) {
    var form = { id: _reset._id, token: _reset.token, password: 'new-pass' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
      done();
    });
  });
  it('old password should fail', function (done) {
    userb.users.findOne({ email: _user.email }, function (err, user) {
      assert.ifError(err);
      userb.checkPassword(_user.password, user.hash, function (err, matched) {
        assert.ifError(err);
        assert2.e(matched, false);
        done();
      });
    });
  });
  it('new password should succeed', function (done) {
    userb.users.findOne({ email: _user.email }, function (err, user) {
      assert.ifError(err);
      userb.checkPassword('new-pass', user.hash, function (err, matched) {
        assert.ifError(err);
        assert2.e(matched, true);
        done();
      });
    });
  });
});

describe('resetting admin', function () {
  var _user;
  var _reset;
  before(function () {
    _user = userf.admin;
  });
  it('old password should succeed', function (done) {
    userb.users.findOne({ email: _user.email }, function (err, user) {
      assert.ifError(err);
      userb.checkPassword(_user.password, user.hash, function (err, matched) {
        assert.ifError(err);
        assert2.e(matched, true);
        done();
      });
    });
  });
  it('given reset request', function (done) {
    var form = { email: _user.email };
    expl.post('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
      done();
    });
  });
  it('can be checked', function (done) {
    userp.resets.findOne({ email: _user.email }, function (err, reset) {
      assert.ifError(err);
      assert2.ne(reset._id, undefined);
      assert2.ne(reset.token, undefined);
      assert2.e((reset.email == _user.email), true);
      _reset = reset;
      done();
    });
  });
  it('should succeed', function (done) {
    var form = { id: _reset._id, token: _reset.token, password: 'new-pass' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert2.empty(res.body.err);
      done();
    });
  });
  it('old password should succeed', function (done) {
    userb.users.findOne({ email: _user.email }, function (err, user) {
      assert.ifError(err);
      userb.checkPassword(_user.password, user.hash, function (err, matched) {
        assert.ifError(err);
        assert2.e(matched, true);
        done();
      });
    });
  });
  it('new password should fail', function (done) {
    userb.users.findOne({ email: _user.email }, function (err, user) {
      assert.ifError(err);
      userb.checkPassword('new-pass', user.hash, function (err, matched) {
        assert.ifError(err);
        assert2.e(matched, false);
        done();
      });
    });
  });
});
