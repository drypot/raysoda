'use strict';

const assert = require('assert');
const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userb = require('../user/user-base');
const usern = require('../user/user-new');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('emailx test', function () {
  it('should succeed', function () {
    assert.strictEqual(usern.emailx.test('abc.mail.com'), false);
    assert.strictEqual(usern.emailx.test('abc*xyz@mail.com'), false);
    assert.strictEqual(usern.emailx.test('-a-b-c_d-e-f@mail.com'), true);
    assert.strictEqual(usern.emailx.test('develop.bj@mail.com'), true);
  });
});

describe('getNewId', function () {
  it('should succeed', function () {
    var id1 = userb.getNewId();
    var id1 = userb.getNewId();
    var id2 = userb.getNewId();
    var id2 = userb.getNewId();
    assert.strictEqual(id1 < id2, true);
  });
});

describe('post /api/users', function () {
  describe('creating new user', function () {
    it('should succeed', function (done) {
      var form = { name: 'Name', email: 'name@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(res.body.err);
        let id = res.body.id;
        my2.queryOne('select * from user where id = ?', id, (err, user) => {
          assert.ifError(err);
          assert.strictEqual(user.name, 'Name');
          assert.strictEqual(user.namel, 'name');
          assert.strictEqual(user.home, 'Name');
          assert.strictEqual(user.homel, 'name');
          assert.strictEqual(user.email, 'name@mail.com');
          userb.checkPassword('1234', user.hash, function (err, matched) {
            assert.strictEqual(matched, true);
            userb.checkPassword('4444', user.hash, function (err, matched) {
              assert.strictEqual(matched, false);
              done();
            });
          });
        });
      });
    });
  });
  describe('name check', function () {
    before(function (done) {
      my2.query('truncate table user', done);
    });
    before(function (done) {
      // 정규 create api 로는 home 이름을 세팅할 수 없기 때문에 디비에 직접 넣는다.
      let user = userb.getNewUser();
      user.id = userb.getNewId();
      user.name = 'Name1';
      user.namel = 'name1';
      user.home = 'Home1';
      user.homel = 'home1';
      user.email = 'name1@mail.com';
      my2.query('insert into user set ?', user, done);
    });
    it('should fail when name duped with name', function (done) {
      var form = { name: 'NAME1', email: 'nameduped@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert(res.body.err);
        assert(error.find(res.body.err, 'NAME_DUPE'));
        done();
      });
    });
    it('should fail when name duped with home', function (done) {
      var form = { name: 'HOME1', email: 'nameduped@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert(res.body.err);
        assert(error.find(res.body.err, 'NAME_DUPE'));
        done();
      });
    });
    it('should succeed when name length 1', function (done) {
      var form = { name: '1', email: 'namelen1@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should succeed when name length 32', function (done) {
      var form = { name: '12345678901234567890123456789012', email: 'name32@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should fail when name empty', function (done) {
      var form = { name: '', email: 'nameempty@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert(error.find(res.body.err, 'NAME_EMPTY'));
        done();
      });
    });
    it('should fail when name long', function (done) {
      var form = { name: '123456789012345678901234567890123', email: 'namelong@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert(res.body.err);
        assert(error.find(res.body.err, 'NAME_RANGE'));
        done();
      });
    });
  });
  describe('email check', function () {
    before(function (done) {
      my2.query('truncate table user', done);
    });
    before(function (done) {
      var form = { name: 'name1', email: 'name1@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should fail when mail duped', function (done) {
      var form = { name: 'name2', email: 'name1@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert(res.body.err);
        assert(error.find(res.body.err, 'EMAIL_DUPE'));
        done();
      });
    });
    it('should fail when mail duped with different case', function (done) {
      var form = { name: 'name3', email: 'Name1@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert(res.body.err);
        assert(error.find(res.body.err, 'EMAIL_DUPE'));
        done();
      });
    });
    it('should fail when email invalid', function (done) {
      var form = { name: 'name4', email: 'abc.mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert(res.body.err);
        assert(error.find(res.body.err, 'EMAIL_PATTERN'));
        done();
      });
    });
    it('should fail when email invalid', function (done) {
      var form = { name: 'name5', email: 'abc*xyz@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert(res.body.err);
        assert(error.find(res.body.err, 'EMAIL_PATTERN'));
        done();
      });
    });
    it('should succeed dashed', function (done) {
      var form = { name: 'name6', email: '-a-b-c_d-e-f@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should succeed with +', function (done) {
      var form = { name: 'name7', email: 'abc+xyz@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
  });
  describe('password check', function () {
    before(function (done) {
      my2.query('truncate table user', done);
    });
    it('should succeed password 32', function (done) {
      var form = { name: 'name1', email: 'pass32@mail.com', password: '12345678901234567890123456789012' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should fail when password short', function (done) {
      var form = { name: 'name2', email: 'passshort@mail.com', password: '123' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert(res.body.err);
        assert(error.find(res.body.err, 'PASSWORD_RANGE'));
        done();
      });
    });
    it('should fail when password long', function (done) {
      var form = { name: 'name3', email: 'passlong@mail.com', password: '123456789012345678901234567890123' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert(res.body.err);
        assert(error.find(res.body.err, 'PASSWORD_RANGE'));
        done();
      });
    });
  });
});



