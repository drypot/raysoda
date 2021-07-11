import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as userb from "../user/user-base.mjs";
import * as usern from "../user/user-new.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('emailx test', () => {
  it('should succeed', () => {
    expect(usern.emailx.test('abc.mail.com')).toBe(false);
    expect(usern.emailx.test('abc*xyz@mail.com')).toBe(false);
    expect(usern.emailx.test('-a-b-c_d-e-f@mail.com')).toBe(true);
    expect(usern.emailx.test('develop.bj@mail.com')).toBe(true);
  });
});

describe('getNewId', () => {
  it('should succeed', () => {
    let id1, id2;
    id1 = userb.getNewId();
    id1 = userb.getNewId();
    id2 = userb.getNewId();
    id2 = userb.getNewId();
    expect(id1 < id2).toBe(true);
  });
});

describe('post /api/users', () => {
  describe('creating new user', () => {
    it('should succeed', done => {
      const form = {name: 'Name', email: 'name@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(res.body.err);
        let id = res.body.id;
        db.queryOne('select * from user where id = ?', id, (err, user) => {
          expect(err).toBeFalsy();
          expect(user.name).toBe('Name');
          expect(user.home).toBe('Name');
          expect(user.email).toBe('name@mail.com');
          userb.checkPassword('1234', user.hash, function (err, matched) {
            expect(matched).toBe(true);
            userb.checkPassword('4444', user.hash, function (err, matched) {
              expect(matched).toBe(false);
              done();
            });
          });
        });
      });
    });
  });
  describe('name check', () => {
    beforeAll(done => {
      db.query('truncate table user', done);
    });
    beforeAll(done => {
      // 정규 create api 로는 home 이름을 세팅할 수 없기 때문에 디비에 직접 넣는다.
      let user = userb.getNewUser();
      user.id = userb.getNewId();
      user.name = 'Name1';
      user.home = 'Home1';
      user.email = 'name1@mail.com';
      db.query('insert into user set ?', user, done);
    });
    it('should fail when name duped with name', done => {
      const form = {name: 'NAME1', email: 'nameduped@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'NAME_DUPE'));
        done();
      });
    });
    it('should fail when name duped with home', done => {
      const form = {name: 'HOME1', email: 'nameduped@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'NAME_DUPE'));
        done();
      });
    });
    it('should succeed when name length 1', done => {
      const form = {name: '1', email: 'namelen1@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        done();
      });
    });
    it('should succeed when name length 32', done => {
      const form = {name: '12345678901234567890123456789012', email: 'name32@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        done();
      });
    });
    it('should fail when name empty', done => {
      const form = {name: '', email: 'nameempty@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ok(error.errorExists(res.body.err, 'NAME_EMPTY'));
        done();
      });
    });
    it('should fail when name long', done => {
      const form = {name: '123456789012345678901234567890123', email: 'namelong@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'NAME_RANGE'));
        done();
      });
    });
  });
  describe('email check', () => {
    beforeAll(done => {
      db.query('truncate table user', done);
    });
    beforeAll(done => {
      const form = {name: 'name1', email: 'name1@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(res.body.err);
        done();
      });
    });
    it('should fail when mail duped', done => {
      const form = {name: 'name2', email: 'name1@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'EMAIL_DUPE'));
        done();
      });
    });
    it('should fail when mail duped with different case', done => {
      const form = {name: 'name3', email: 'Name1@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'EMAIL_DUPE'));
        done();
      });
    });
    it('should fail when email invalid', done => {
      const form = {name: 'name4', email: 'abc.mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'EMAIL_PATTERN'));
        done();
      });
    });
    it('should fail when email invalid', done => {
      const form = {name: 'name5', email: 'abc*xyz@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'EMAIL_PATTERN'));
        done();
      });
    });
    it('should succeed dashed', done => {
      const form = {name: 'name6', email: '-a-b-c_d-e-f@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        done();
      });
    });
    it('should succeed with +', done => {
      const form = {name: 'name7', email: 'abc+xyz@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        done();
      });
    });
  });
  describe('password check', () => {
    beforeAll(done => {
      db.query('truncate table user', done);
    });
    it('should succeed password 32', done => {
      const form = {name: 'name1', email: 'pass32@mail.com', password: '12345678901234567890123456789012'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        done();
      });
    });
    it('should fail when password short', done => {
      const form = {name: 'name2', email: 'passshort@mail.com', password: '123'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'PASSWORD_RANGE'));
        done();
      });
    });
    it('should fail when password long', done => {
      const form = {name: 'name3', email: 'passlong@mail.com', password: '123456789012345678901234567890123'};
      expl.post('/api/users').send(form).end(function (err,res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'PASSWORD_RANGE'));
        done();
      });
    });
  });
});



