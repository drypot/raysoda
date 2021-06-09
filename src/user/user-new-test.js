import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";
import * as expl from "../express/express-local.js";
import * as userb from "../user/user-base.js";
import * as usern from "../user/user-new.js";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('emailx test', function () {
  it('should succeed', function () {
    assert2.e(usern.emailx.test('abc.mail.com'), false);
    assert2.e(usern.emailx.test('abc*xyz@mail.com'), false);
    assert2.e(usern.emailx.test('-a-b-c_d-e-f@mail.com'), true);
    assert2.e(usern.emailx.test('develop.bj@mail.com'), true);
  });
});

describe('getNewId', function () {
  it('should succeed', function () {
    let id1, id2;
    id1 = userb.getNewId();
    id1 = userb.getNewId();
    id2 = userb.getNewId();
    id2 = userb.getNewId();
    assert2.e(id1 < id2, true);
  });
});

describe('post /api/users', function () {
  describe('creating new user', function () {
    it('should succeed', function (done) {
      const form = {name: 'Name', email: 'name@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(res.body.err);
        let id = res.body.id;
        db.queryOne('select * from user where id = ?', id, (err, user) => {
          assert2.ifError(err);
          assert2.e(user.name, 'Name');
          assert2.e(user.home, 'Name');
          assert2.e(user.email, 'name@mail.com');
          userb.checkPassword('1234', user.hash, function (err, matched) {
            assert2.e(matched, true);
            userb.checkPassword('4444', user.hash, function (err, matched) {
              assert2.e(matched, false);
              done();
            });
          });
        });
      });
    });
  });
  describe('name check', function () {
    before(function (done) {
      db.query('truncate table user', done);
    });
    before(function (done) {
      // 정규 create api 로는 home 이름을 세팅할 수 없기 때문에 디비에 직접 넣는다.
      let user = userb.getNewUser();
      user.id = userb.getNewId();
      user.name = 'Name1';
      user.home = 'Home1';
      user.email = 'name1@mail.com';
      db.query('insert into user set ?', user, done);
    });
    it('should fail when name duped with name', function (done) {
      const form = {name: 'NAME1', email: 'nameduped@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'NAME_DUPE'));
        done();
      });
    });
    it('should fail when name duped with home', function (done) {
      const form = {name: 'HOME1', email: 'nameduped@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'NAME_DUPE'));
        done();
      });
    });
    it('should succeed when name length 1', function (done) {
      const form = {name: '1', email: 'namelen1@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        done();
      });
    });
    it('should succeed when name length 32', function (done) {
      const form = {name: '12345678901234567890123456789012', email: 'name32@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        done();
      });
    });
    it('should fail when name empty', function (done) {
      const form = {name: '', email: 'nameempty@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ok(error.find(res.body.err, 'NAME_EMPTY'));
        done();
      });
    });
    it('should fail when name long', function (done) {
      const form = {name: '123456789012345678901234567890123', email: 'namelong@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'NAME_RANGE'));
        done();
      });
    });
  });
  describe('email check', function () {
    before(function (done) {
      db.query('truncate table user', done);
    });
    before(function (done) {
      const form = {name: 'name1', email: 'name1@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(res.body.err);
        done();
      });
    });
    it('should fail when mail duped', function (done) {
      const form = {name: 'name2', email: 'name1@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'EMAIL_DUPE'));
        done();
      });
    });
    it('should fail when mail duped with different case', function (done) {
      const form = {name: 'name3', email: 'Name1@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'EMAIL_DUPE'));
        done();
      });
    });
    it('should fail when email invalid', function (done) {
      const form = {name: 'name4', email: 'abc.mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'EMAIL_PATTERN'));
        done();
      });
    });
    it('should fail when email invalid', function (done) {
      const form = {name: 'name5', email: 'abc*xyz@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'EMAIL_PATTERN'));
        done();
      });
    });
    it('should succeed dashed', function (done) {
      const form = {name: 'name6', email: '-a-b-c_d-e-f@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        done();
      });
    });
    it('should succeed with +', function (done) {
      const form = {name: 'name7', email: 'abc+xyz@mail.com', password: '1234'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        done();
      });
    });
  });
  describe('password check', function () {
    before(function (done) {
      db.query('truncate table user', done);
    });
    it('should succeed password 32', function (done) {
      const form = {name: 'name1', email: 'pass32@mail.com', password: '12345678901234567890123456789012'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        done();
      });
    });
    it('should fail when password short', function (done) {
      const form = {name: 'name2', email: 'passshort@mail.com', password: '123'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'PASSWORD_RANGE'));
        done();
      });
    });
    it('should fail when password long', function (done) {
      const form = {name: 'name3', email: 'passlong@mail.com', password: '123456789012345678901234567890123'};
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'PASSWORD_RANGE'));
        done();
      });
    });
  });
});



