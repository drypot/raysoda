'use strict';

const assert = require('assert');
const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userb = require('../user/user-base');
const userf = require('../user/user-fixture');
const userp = require('../user/user-reset-pass');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('resetting user', function () {
  let _user;
  let _reset;
  before(function () {
    _user = userf.user1;
  });
  it('old password should be ok', function (done) {
    my2.queryOne('select * from user where email = ?', _user.email, (err, user) => {
      assert.ifError(err);
      userb.checkPassword(_user.password, user.hash, function (err, matched) {
        assert.ifError(err);
        assert.strictEqual(matched, true);
        done();
      });
    });
  });
  it('reset request should succeed', function (done) {
    expl.post('/api/reset-pass').send({ email: _user.email }).end(function (err, res) {
      assert.ifError(err);
      console.log(res.body.err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', function (done) {
    my2.queryOne('select * from pwreset where email = ?', _user.email, (err, reset) => {
      assert.ifError(err);
      assert.notStrictEqual(reset.uuid, undefined);
      assert.notStrictEqual(reset.token, undefined);
      assert.strictEqual(reset.email, _user.email);
      _reset = reset;
      done();
    });
  });
  it('invalid email should fail', function (done) {
    expl.post('/api/reset-pass').send({ email: 'abc.def.xyz' }).end(function (err, res) {
      assert.ifError(err);
      assert(res.body.err);
      assert(error.find(res.body.err, 'EMAIL_PATTERN'));
      done();
    });
  });
  it('unregistered email should fail', function (done) {
    expl.post('/api/reset-pass').send({ email: 'non-exist@xyz.com' }).end(function (err, res) {
      assert.ifError(err);
      assert(res.body.err);
      assert(error.find(res.body.err, 'EMAIL_NOT_EXIST'));
      done();
    });
  });
  it('invalid id should fail', function (done) {
    var form = { uuid: '012345678901234567890123', token: _reset.token, password: '4567' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert(res.body.err);
      assert(error.find(res.body.err, 'INVALID_DATA'));
      done();
    });
  });
  it('invalid token should fail', function (done) {
    var form = { uuid: _reset.uuid, token: 'xxxxx', password: '4567' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert(res.body.err);
      assert(error.find(res.body.err, 'INVALID_DATA'));
      done();
    });
  });
  it('invalid password should fail', function (done) {
    var form = { uuid: _reset.uuid, token: _reset.token, password: '' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert(res.body.err);
      assert(error.find(res.body.err, 'PASSWORD_EMPTY'));
      done();
    });
  });
  it('invalid password should fail', function (done) {
    var form = { uuid: _reset.uuid, token: _reset.token, password: 'xx' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert(res.body.err);
      assert(error.find(res.body.err, 'PASSWORD_RANGE'));
      done();
    });
  });
  it('should succeed', function (done) {
    var form = { uuid: _reset.uuid, token: _reset.token, password: 'new-pass' };
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('old password should fail', function (done) {
    my2.queryOne('select * from user where email = ?', _user.email, (err, user) => {
      assert.ifError(err);
      userb.checkPassword(_user.password, user.hash, function (err, matched) {
        assert.ifError(err);
        assert.strictEqual(matched, false);
        done();
      });
    });
  });
  it('new password should succeed', function (done) {
    my2.queryOne('select * from user where email = ?', _user.email, (err, user) => {
      assert.ifError(err);
      userb.checkPassword('new-pass', user.hash, function (err, matched) {
        assert.ifError(err);
        assert.strictEqual(matched, true);
        done();
      });
    });
  });
});