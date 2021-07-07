import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as userb from "../user/user-base.mjs";
import * as userf from "../user/user-fixture.mjs";
import * as userp from "../user/user-reset-pass.mjs";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
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
    _user = userf.users.user1;
  });
  it('old password should be ok', function (done) {
    db.queryOne('select * from user where email = ?', _user.email, (err, user) => {
      assert2.ifError(err);
      userb.checkPassword(_user.password, user.hash, function (err, matched) {
        assert2.ifError(err);
        assert2.e(matched, true);
        done();
      });
    });
  });
  it('reset request should succeed', function (done) {
    expl.post('/api/reset-pass').send({ email: _user.email }).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', function (done) {
    db.queryOne('select * from pwreset where email = ?', _user.email, (err, reset) => {
      assert2.ifError(err);
      assert2.ne(reset.uuid, undefined);
      assert2.ne(reset.token, undefined);
      assert2.e(reset.email, _user.email);
      _reset = reset;
      done();
    });
  });
  it('invalid email should fail', function (done) {
    expl.post('/api/reset-pass').send({ email: 'abc.def.xyz' }).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'EMAIL_PATTERN'));
      done();
    });
  });
  it('unregistered email should fail', function (done) {
    expl.post('/api/reset-pass').send({ email: 'non-exist@xyz.com' }).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'EMAIL_NOT_EXIST'));
      done();
    });
  });
  it('invalid id should fail', function (done) {
    const form = {uuid: '012345678901234567890123', token: _reset.token, password: '4567'};
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'INVALID_DATA'));
      done();
    });
  });
  it('invalid token should fail', function (done) {
    const form = {uuid: _reset.uuid, token: 'xxxxx', password: '4567'};
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'INVALID_DATA'));
      done();
    });
  });
  it('invalid password should fail', function (done) {
    const form = {uuid: _reset.uuid, token: _reset.token, password: ''};
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'PASSWORD_EMPTY'));
      done();
    });
  });
  it('invalid password should fail', function (done) {
    const form = {uuid: _reset.uuid, token: _reset.token, password: 'xx'};
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'PASSWORD_RANGE'));
      done();
    });
  });
  it('should succeed', function (done) {
    const form = {uuid: _reset.uuid, token: _reset.token, password: 'new-pass'};
    expl.put('/api/reset-pass').send(form).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('old password should fail', function (done) {
    db.queryOne('select * from user where email = ?', _user.email, (err, user) => {
      assert2.ifError(err);
      userb.checkPassword(_user.password, user.hash, function (err, matched) {
        assert2.ifError(err);
        assert2.e(matched, false);
        done();
      });
    });
  });
  it('new password should succeed', function (done) {
    db.queryOne('select * from user where email = ?', _user.email, (err, user) => {
      assert2.ifError(err);
      userb.checkPassword('new-pass', user.hash, function (err, matched) {
        assert2.ifError(err);
        assert2.e(matched, true);
        done();
      });
    });
  });
});
