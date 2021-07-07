import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expl from "../express/express-local.mjs";
import * as expb from "../express/express-base.mjs";
import * as userb from "../user/user-base.mjs";
import * as usern from "../user/user-new.mjs";
import * as userv from "../user/user-view.mjs";
import * as userf from "../user/user-fixture.mjs";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('finding user', function () {
  const _user = {name: 'test', email: 'test@def.com', password: '1234'};
  it('given new user', function (done) {
    expl.post('/api/users').send(_user).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      _user.id = res.body.id;
      done();
    });
  });
  it('given login', function (done) {
    const form = {email: _user.email, password: _user.password};
    expl.post('/api/users/login').send(form).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('should succeed with email field', function (done) {
    expl.get('/api/users/' + _user.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.user.id, _user.id);
      assert2.e(res.body.user.name, _user.name);
      assert2.e(res.body.user.email, _user.email);
      done();
    });
  });
  it('given other\'s login', function (done) {
    userf.login('user2', done);
  });
  it('should succeed without email', function (done) {
    expl.get('/api/users/' + _user.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.user.id, _user.id);
      assert2.e(res.body.user.name, _user.name);
      assert2.e(res.body.user.email, undefined);
      done();
    });
  });
  it('given admin login', function (done) {
    userf.login('admin', done);
  });
  it('should succeed with email', function (done) {
    expl.get('/api/users/' + _user.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.user.id, _user.id);
      assert2.e(res.body.user.name, _user.name);
      assert2.e(res.body.user.email, _user.email);
      done();
    });
  });
  it('given no login', function (done) {
    userf.logout(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      done();
    })
  });
  it('should succeed without email', function (done) {
    expl.get('/api/users/' + _user.id).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.user.id, _user.id);
      assert2.e(res.body.user.name, _user.name);
      assert2.e(res.body.user.profile, '');
      assert2.e(res.body.user.email, undefined);
      done();
    });
  });
  it('should fail with invalid id', function (done) {
    expl.get('/api/users/999').end(function (err, res) {
      assert2.ifError(err);
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'USER_NOT_FOUND'));
      done();
    });
  });
});

