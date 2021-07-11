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

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('finding user', () => {
  const _user = {name: 'test', email: 'test@def.com', password: '1234'};
  it('given new user', done => {
    expl.post('/api/users').send(_user).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      _user.id = res.body.id;
      done();
    });
  });
  it('given login', done => {
    const form = {email: _user.email, password: _user.password};
    expl.post('/api/users/login').send(form).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('should succeed with email field', done => {
    expl.get('/api/users/' + _user.id).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.user.id).toBe(_user.id);
      expect(res.body.user.name).toBe(_user.name);
      expect(res.body.user.email).toBe(_user.email);
      done();
    });
  });
  it('given other\'s login', done => {
    userf.login('user2', done);
  });
  it('should succeed without email', done => {
    expl.get('/api/users/' + _user.id).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.user.id).toBe(_user.id);
      expect(res.body.user.name).toBe(_user.name);
      expect(res.body.user.email).toBe(undefined);
      done();
    });
  });
  it('given admin login', done => {
    userf.login('admin', done);
  });
  it('should succeed with email', done => {
    expl.get('/api/users/' + _user.id).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.user.id).toBe(_user.id);
      expect(res.body.user.name).toBe(_user.name);
      expect(res.body.user.email).toBe(_user.email);
      done();
    });
  });
  it('given no login', done => {
    userf.logout(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    })
  });
  it('should succeed without email', done => {
    expl.get('/api/users/' + _user.id).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.user.id).toBe(_user.id);
      expect(res.body.user.name).toBe(_user.name);
      expect(res.body.user.profile).toBe('');
      expect(res.body.user.email).toBe(undefined);
      done();
    });
  });
  it('should fail with invalid id', done => {
    expl.get('/api/users/999').end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ok(res.body.err);
      assert2.ok(error.errorExists(res.body.err, 'USER_NOT_FOUND'));
      done();
    });
  });
});

